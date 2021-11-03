import BasicSkeleton from '../chapter-01/BasicSkeleton';
import MaterialsLight from '../chapter-01/MaterialsLight';
import MaterialsLightAnimation from '../chapter-01/MaterialsLightAnimation';
import ControlGui from '../chapter-01/ControlGui';
import BasicScene from '../chapter-02/BasicScene';
import CustomGeometry from '../chapter-02/CustomGeometry';
import MeshProperties from '../chapter-02/MeshProperties';

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
  },
  {
    name: 'chapter-02',
    children: [
      {
        name: 'BasicScene',
        path: '/BasicScene',
        component: BasicScene
      },
      {
        name: 'CustomGeometry',
        path: '/CustomGeometry',
        component: CustomGeometry
      },
      {
        name: 'MeshProperties',
        path: '/MeshProperties',
        component: MeshProperties
      }
    ]
  }
];
