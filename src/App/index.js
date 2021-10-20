import './index.less';
import { Redirect, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Sidebar } from './Sidebar';

import BasicSkeleton from '../chapter-01/BasicSkeleton';
import MaterialsLight from '../chapter-01/MaterialsLight';
import MaterialsLightAnimation from '../chapter-01/MaterialsLightAnimation';

const Routes = [
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
      }
    ]
  }
];

export default function App() {
  return (
    <div className='app'>
      <Sidebar data={Routes} />
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/BasicSkeleton' />} />
        {Routes.map(x => x.children)
          .flat(1)
          .map(({ path, component }, idx) => (
            <Route key={idx} path={path} component={component} />
          ))}
      </Switch>
    </div>
  );
}
