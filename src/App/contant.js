import BasicSkeleton from '../chapter-01/BasicSkeleton';
import MaterialsLight from '../chapter-01/MaterialsLight';
import MaterialsLightAnimation from '../chapter-01/MaterialsLightAnimation';
import ControlGui from '../chapter-01/ControlGui';

export const Routes = [
  {
    name: 'chapter-01',
    children: [
      {
        name: 'BasicSkeleton',
        path: '/BasicSkeleton',
        component: BasicSkeleton
      },
      {
        name: 'MaterialsLight',
        path: '/MaterialsLight',
        component: MaterialsLight
      },
      {
        name: 'MaterialsLightAnimation',
        path: '/MaterialsLightAnimation',
        component: MaterialsLightAnimation
      },
      {
        name: 'ControlGui',
        path: '/ControlGui',
        component: ControlGui
      }
    ]
  }
];
