import React from 'react'
import styles from 'styled-components'

const BodyContainer = styles.div`
    width: 100%;
    // position: relative;
    padding: 16px 8px;
    background: #040404;
`

const Body: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => {
  
    return (
        <>
            <BodyContainer>
                {children}
            </BodyContainer>
        </>
    )
}

export default Body