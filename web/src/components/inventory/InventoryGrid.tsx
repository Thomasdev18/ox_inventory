import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faBriefcase, faUserTie } from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  return (
    <>
      <div
        className={inventory.type === 'player' ? 'inventory-grid-wrapper-user' : 'inventory-grid-wrapper'}
        style={{ pointerEvents: isBusy ? 'none' : 'auto' }}
      >
      <div>
        <div
          className={inventory.type === 'player' ? 'inventory-grid-header-wrapper-user' : 'inventory-grid-header-wrapper'}
        >
          <p className="LabelText">
            <div className="iconWrapper">
              <FontAwesomeIcon icon={inventory.type === 'player' ? faBriefcase : faList} />
            </div>
            <span style={{ color: '#fff', marginLeft: '0px', textTransform: 'uppercase'}}>
              {inventory.type === 'player' ? (
                // Display the player's name instead of "INVENTAR"
                inventory.label
              ) : (
                // Display the inventory label for non-player inventory types
                inventory.label === undefined ? 'BAKKEN' : inventory.label
              )}
            </span>
          </p>
        </div>
      </div>
        <div
          className={inventory.type === 'player' ? 'inventory-grid-container-user' : 'inventory-grid-container'}
          ref={containerRef}
        >
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
        <div
          className={inventory.type === 'player' ? 'WeightBarWrap' : 'WeightBarWrap2'}
          style={{ position: 'relative' }}
        >
          <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
          {inventory.maxWeight && (
            <p className="WeightText">
              Vekt: {weight / 1000}/{inventory.maxWeight / 1000}kg
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;