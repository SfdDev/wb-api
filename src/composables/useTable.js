export function useTable () {
    const filteredDataByType = (field, source) => {
        const rawData = Array.isArray(source) ? source : (source?.value?.data || source?.data || []);
        // Универсальная фильтрация по любому полю, без исключений
        return rawData.filter(item => item[field] !== undefined && item[field] !== null && item[field] !== '');
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

          console.log(prevItem);
          console.log(currentValue, prevValue);
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


