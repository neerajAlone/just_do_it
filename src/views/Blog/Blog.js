import React, { Fragment } from 'react';

import { BlogRoutes } from '../../routes';

function Blog(props) {
  return <Fragment>
    <div style={{ width: '100%',
        padding: '0 6px',
        boxSizing: 'border-box'
      }}><h1 style={{
        fontWeight: 'normal',
        letterSpacing: 3,
        color: 'orangered'
      }}>BLOGS</h1>
    </div>
    <BlogRoutes />
  </Fragment>
}

export default Blog;
