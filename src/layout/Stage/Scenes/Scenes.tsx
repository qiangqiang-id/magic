import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { magic } from '@/store';
import SceneStruc from '@/models/SceneStruc';
import Scene from './Scene/Scene';

import Style from './Scenes.module.less';

interface SceneProps {
  scene: SceneStruc;
  actived: boolean;
}

function SortbleScene(props: SceneProps) {
  const { scene } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: scene.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Scene
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
}

function Scenes() {
  const { scenes, activedScene } = magic;
  const [dragScene, setDragScene] = useState<SceneStruc | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        /** 移动距离超过 5px 才算是 move，否则是 click */
        distance: 5,
      },
    }),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const scene = scenes.find(({ id }) => id === event.active.id);
    scene && setDragScene(scene);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over?.id) {
      const oldIndex = magic.getSceneIndex(active.id as string);
      const newIndex = magic.getSceneIndex(over.id as string);
      const newScenes = arrayMove(scenes, oldIndex, newIndex);
      magic.setScenes(newScenes);
    }
  };

  const handleDragCancel = () => {
    setDragScene(null);
  };

  return (
    <div className={Style.scenes}>
      <div className={Style.scenes_content}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={scenes.map(scene => scene.id)}
            strategy={horizontalListSortingStrategy}
          >
            {scenes.map(scene => (
              <SortbleScene
                key={scene.id}
                scene={scene}
                actived={activedScene?.id === scene.id}
              />
            ))}
          </SortableContext>

          <DragOverlay adjustScale>
            {!!dragScene && (
              <Scene
                scene={dragScene}
                actived={dragScene.id === activedScene?.id}
              />
            )}
          </DragOverlay>
        </DndContext>

        <div className={Style.add_item} onClick={() => magic.addScene()}>
          <PlusOutlined
            style={{
              fontSize: 25,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(Scenes);
