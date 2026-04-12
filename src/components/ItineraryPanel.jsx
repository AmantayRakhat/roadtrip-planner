import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  MoreHorizontal, Share2, Printer, FileText,
  Users, ChevronRight, Eye, EyeOff, Image as ImageIcon,
  Home, Trash2, GripVertical, Navigation
} from 'lucide-react';
import './ItineraryPanel.css';

// ─── Sortable Stop Item (The "Perfect" Structure) ───────────────────────────
const SortableStop = ({ stop, index, visibleIndex, lineType, total, nextStop, activeMenuId, toggleMenu, handleRemoveStop, onFindStops, onToggleVisibility, isLast }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1, /* Slightly more opaque during drag */
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`route-stop-item ${isLast ? 'is-last-stop' : ''} ${stop.isVisible === false ? 'is-hidden' : ''} line-${lineType}`}>
      <div className="stop-left-column">
        {stop.isVisible !== false && <div className="stop-number">{visibleIndex}</div>}
      </div>

      <div className="stop-main-card">
        <div className="stop-card">
          <div className="drag-handle-wizard" {...attributes} {...listeners}>
            <GripVertical size={16} color="#9ca3af" />
          </div>
          <div className="stop-thumbnail">
            {stop.type === 'city' ? <Home size={20} /> : <ImageIcon size={20} />}
            <img src={stop.img} alt={stop.name} />
          </div>
          <div className="stop-details">
            <h4>{stop.name}</h4>
          </div>
          <div className="stop-actions-right">
            <div className="more-menu-container">
              <button
                className={`action-icon-btn ${activeMenuId === stop.id ? 'active' : ''}`}
                onClick={(e) => toggleMenu(e, stop.id)}
              >
                <MoreHorizontal size={20} />
              </button>
              {activeMenuId === stop.id && (
                <div className="stop-action-dropdown">
                  <button className="dropdown-item delete" onClick={() => handleRemoveStop(stop.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              )}
            </div>
            <button 
              className={`eye-action-btn ${stop.isVisible === false ? 'hidden' : 'visible'}`} 
              onClick={() => onToggleVisibility && onToggleVisibility(stop.id)}
              title={stop.isVisible === false ? "Show on route" : "Hide on route"}
            >
              {stop.isVisible === false ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Footer with Guidance & Distance (Single Row as in Photo 2) */}
        {index < total - 1 && (
          <div className="stop-footer">
            <div className="find-stops-link" onClick={onFindStops}>
              <ChevronRight size={14} /> Find stops here
            </div>
            {nextStop?.distance && (
              <span className="distance-text-plain">
                {nextStop.distance} • {nextStop.time}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Ghost Drag UI ──────────────────────────────────────────────────────────
const DragGhostCard = ({ stop }) => (
  <div
    className="route-stop-item ghost"
    style={{
      opacity: 0.9,
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
      borderRadius: 12,
      background: 'white',
      transform: 'scale(1.02)',
      cursor: 'grabbing',
      display: 'flex',
      gap: '1.25rem',
      padding: '0.25rem'
    }}
  >
    <div className="stop-left-column">
      <div className="stop-number">·</div>
    </div>
    <div className="stop-main-card" style={{ flex: 1 }}>
      <div className="stop-card">
        <div className="drag-handle-wizard">
          <GripVertical size={16} color="#1a365d" />
        </div>
        <div className="stop-thumbnail">
          <ImageIcon size={20} />
          <img src={stop.img} alt={stop.name} />
        </div>
        <div className="stop-details">
          <h4>{stop.name}</h4>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const ItineraryPanel = ({ onClose, onFindStops, stops = [], onUpdateStops, onRecalculate }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleRemoveStop = (id) => {
    if (onUpdateStops) {
      onUpdateStops(prev => prev.filter(stop => stop.id !== id));
    }
    setActiveMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setActiveMenuId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex(s => s.id === active.id);
    const newIndex = stops.findIndex(s => s.id === over.id);

    const reordered = arrayMove(stops, oldIndex, newIndex);
    if (onUpdateStops) onUpdateStops(reordered);
    if (onRecalculate) onRecalculate(reordered);
  };

  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="itinerary-panel premium-v2">
      <div className="itinerary-body custom-scroll">
        <div className="itinerary-header">
          <div className="header-actions-top">
            <button className="close-trip-btn" onClick={onClose}>Close trip</button>
            <button className="invite-btn"><Users size={16} /> Invite</button>
          </div>
          <div
            className="header-image-bg"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop")' }}
          />
        </div>

        <div className="itinerary-content-scrollable">
          <div className="itinerary-title-card">
            <h1>Kazakhstan Grand Tour</h1>
{/* 
            <div className="title-action-icons">
              <Share2 size={20} />
              <Printer size={20} />
              <FileText size={20} />
            </div>
*/}
          </div>

{/* 
          <div className="itinerary-options-grid">
            <button className="opt-btn">Trip settings</button>
            <button className="opt-btn">Routing options</button>
            <button className="opt-btn">Measure tool</button>
            <button className="opt-btn">Add dates</button>
          </div>
*/}
          {/* <h2 className="itinerary-title">Itinerary</h2> */}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stops.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="route-stops-list premium-list">
                {(() => {
                  let visibleCount = 0;
                  const firstVisibleIdx = stops.findIndex(s => s.isVisible !== false);
                  const reversedIdx = [...stops].reverse().findIndex(s => s.isVisible !== false);
                  const lastVisibleIdx = reversedIdx === -1 ? -1 : stops.length - 1 - reversedIdx;

                  return stops.map((stop, i) => {
                    let lineType = 'middle';
                    if (firstVisibleIdx === -1 || i < firstVisibleIdx || i > lastVisibleIdx) {
                      lineType = 'none';
                    } else if (i === firstVisibleIdx) {
                      lineType = (firstVisibleIdx === lastVisibleIdx) ? 'none' : 'start';
                    } else if (i === lastVisibleIdx) {
                      lineType = 'end';
                    }

                    if (stop.isVisible !== false) visibleCount++;
                    
                    return (
                      <SortableStop
                        key={stop.id}
                        stop={stop}
                        index={i}
                        visibleIndex={visibleCount}
                        lineType={lineType}
                        total={stops.length}
                        nextStop={stops[i + 1]}
                        isLast={i === stops.length - 1}
                        activeMenuId={activeMenuId}
                        toggleMenu={toggleMenu}
                        handleRemoveStop={handleRemoveStop}
                        onFindStops={onFindStops}
                        onToggleVisibility={(id) => onUpdateStops(prev => prev.map(s => s.id === id ? {...s, isVisible: !s.isVisible} : s))}
                      />
                    );
                  });
                })()}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{
              duration: 250,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeId && stops.find(s => s.id === activeId)
                ? <DragGhostCard stop={stops.find(s => s.id === activeId)} />
                : null
              }
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      
      <div className="itinerary-bottom-fixed">
        <button 
          className="btn-go-trip"
          onClick={() => window.open('https://2gis.kz', '_blank')}
        >
          <Navigation size={18} />
          Go Trip with 2GIS
        </button>
      </div>
    </div>
  );
};

export default ItineraryPanel;
