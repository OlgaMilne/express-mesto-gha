import React from 'react';

function NotFoundPage() {
    return (
        <div>
            <p style={{ color: '#9999cc', fontSize: 40, textAlign: 'center', lineHeight: 0.5, fontWeight: 500}}>404</p>
            < h3 style={{ color: '#9999cc', fontSize: 24, textAlign: 'center', lineHeight: 0.5}}>Page Not Found</h3>
            <a href='/' style={{ color: '#9999cc', fontSize: 14, textAlign: 'center', display: 'block',}} >go Home</a>
        </div>
    )
}

export default NotFoundPage;