import React, { useEffect, useRef, useState, useCallback } from 'react';

const VirtualList = ({ items, itemHeight, renderItem, renderCols}) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [visibleItems, setVisibleItems] = useState([]);
    const containerRef = useRef(null);

    const containerHeight = window.innerHeight * 0.95; // 95vh
    const totalHeight = items.length * itemHeight;
    const overscanCount = 10; // Number of extra items to render before and after the visible items

    const handleScroll = useCallback((e) => {
        const scrollTop = e.currentTarget.scrollTop;
        setScrollTop(scrollTop);
    }, []);

    useEffect(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscanCount);
        const endIndex = Math.min(items.length - 1, Math.floor((scrollTop + containerHeight) / itemHeight) + overscanCount);

        const newVisibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
            item,
            index: startIndex + index,
        }));

        setVisibleItems(newVisibleItems);
    }, [scrollTop, items, containerHeight, itemHeight]);

    useEffect(() => {
        const handleResize = () => {
            const newContainerHeight = window.innerHeight * 0.95; // Recalculate the container height on window resize
            // setVisibleItems([]);
            // containerRef.current.scrollTop = 0;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <div
                ref={containerRef}
                style={{ overflowY: 'auto', height: `${containerHeight}px`, position: 'relative' }}
                onScroll={handleScroll}
            >
                <div style={{ height: `${totalHeight + itemHeight}px` }} className={`w-fit overflow-x-auto`}>
                    {renderCols()}
                    {visibleItems.map(({ item, index }) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                top: `${index * itemHeight}px`,
                                height: `${itemHeight}px`,
                                width: '100%',
                            }}
                        >
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default VirtualList;
