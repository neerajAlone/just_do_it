import React, {Suspense, lazy, Fragment} from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './views/Home/Home';
import Loading from './components/Loading/Loading';
const Student = lazy(()=>import('./views/Student/Student'));
const SignBox = lazy(()=>import('./views/SignBox/SignBox'));
const Admin = (window.innerWidth>420)?
  lazy(()=>import('./views/Admin/Admin')):
  lazy(()=>import('./views/Admin/AdminMobile'));
const ProfileBox = lazy(()=>import('./views/ProfileBox/ProfileBox'));
const Client = lazy(()=>import('./views/Client/Client'));
const Contact = lazy(()=>import('./views/Contact/Contact'));

const Blog = lazy(()=>import('./views/Blog/Blog'));
const BlogHome = lazy(()=>import('./views/Blog/views/blogHome/blogHome'));
const BlogPage = lazy(()=>import('./views/Blog/views/blogPage/blogPage'));

function lazyComponent(Component) {
  return props=> <Suspense fallback={<Loading load={true} />}>
    <Component {...props} />
  </Suspense>
}

export function Routes() {
  return <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/student" component={lazyComponent(Student)} />
    <Route path="/signbox" component={lazyComponent(SignBox)} />
    <Route path="/admin" component={lazyComponent(Admin)} />
    <Route path="/profile" component={lazyComponent(ProfileBox)} />
    <Route path="/client" component={lazyComponent(Client)} />
    <Route path="/contact" component={lazyComponent(Contact)} />
    <Route path="/blog" component={lazyComponent(Blog)} />
  </Switch>
}

export function BlogRoutes() {
  return <Fragment>
    <Route exact path="/blog" component={lazyComponent(BlogHome)} />
    <Route path="/blog/blogPage/:b_id" component={lazyComponent(BlogPage)} />
  </Fragment>
}