import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router';

export function Sidebar({ data }) {
  const location = useLocation();
  const history = useHistory();

  const handleNavigate = path => () => {
    history.push(path);
  };

  return (
    <div className='side-bar'>
      {data.map(
        ({ name, children }, idx) =>
          children.length && (
            <ul key={idx} className='side-bar__wrapper'>
              <p className='side-bar__title'>{name}</p>
              {children.map(({ name, path }, idx) => (
                <p key={idx} onClick={handleNavigate(path)} className={classnames('side-bar__sub-title', { 'side-bar__sub-title--active': location.pathname === path })}>
                  {name}
                </p>
              ))}
            </ul>
          )
      )}
    </div>
  );
}
