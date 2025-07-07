export function useTable () {
    const filteredDataByType = (type, source) => {
        const rawData = source.value?.data || [];
        switch (type) {
          case 'total_price':
            return rawData.filter(item => item.total_price);
          case 'orders_count':
            const ordersMap = {};
            rawData.forEach(item => {
              const key = item.nm_id;
              if (key) {
                ordersMap[key] = (ordersMap[key] || 0) + 1;
              }
            });
            return Object.entries(ordersMap).map(([nm_id, count]) => ({ nm_id, count }));
          case 'discount_percent':
            return rawData.filter(item => item.discount_percent);
          case 'income_id':
            return rawData.filter(item => item.income_id);
          default:
            return rawData;
        }
      };
      
      function getTopChanges(type, valueField, source, prevData) {
        const current = filteredDataByType(type, source);
        const prev = filteredDataByType(type, prevData);
        const prevMap = {};
        prev.forEach(item => {
          prevMap[item.nm_id] = item;
        });
      
        const changes = current.map(item => {
          const prevItem = prevMap[item.nm_id] || {};
          const currentValue = item[valueField] || 0;
          const prevValue = prevItem[valueField] || 0;
          const percentChange = prevValue === 0 ? (currentValue === 0 ? 0 : 100) : ((currentValue - prevValue) / Math.abs(prevValue)) * 100;
          return {
            nm_id: item.nm_id,
            currentValue,
            prevValue,
            percentChange: `<span class="${percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : ''}">${percentChange.toFixed(2)}%</span>`,
            arrows: percentChange > 0 ? '<span class="arrow up">▲</span>' : '<span class="arrow down">▼</span>'
            
          };
        });
      
        return changes
          .filter(row => row.nm_id)
          .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
          .slice(0, 10);
      }

      return {
        filteredDataByType,
        getTopChanges
      }
}


