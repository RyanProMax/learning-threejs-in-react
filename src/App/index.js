import './index.less';
import { Redirect, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Routes } from './contant';

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
