import BorderButton from 'components/Button/BorderButton'
import Page from 'components/layout/Page'
import React from 'react'
import styles from 'styled-components'
import { Label, Text } from 'components/Text'
import { Heading } from 'components'
import Body from 'components/layout/Body'


const HeadingContainer = styles.div`
    width: 100%;
    display: flex;
    justify-content: start;
    margin: 0px 8px;
`

const StyledButton = styles.button`
    cursor: pointer;
    text-decoration: underline;
    text-transform: uppercase;
`

const LabelWrapper = styles.div`
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
`

const ValueWrapper = styles(Text)`
    color: white;
    width: 100%;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
const RowWrapper = styles.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin: 16px;
`

const Account: React.FC = () => {
    const pageHeading = (<HeadingContainer >
                            <Heading >My Account</Heading>
                                <StyledButton style={{background: "transparent", border: "none", color: "white", marginLeft: "8px"}}>
                                    View Bank
                                </StyledButton>
                        </HeadingContainer>)
    return (
        <>
            <Page>
                {pageHeading}
                <Body>
                    {/* <h4>Chain: {chainId}</h4> */}
                    <LabelWrapper>
                        <Label>
                            Wallet Balance
                            </Label>
                        <BorderButton>
                                Add Funds
                            </BorderButton>
                    </LabelWrapper>
                        <RowWrapper>
                            <ValueWrapper>
                                Balance
                            </ValueWrapper>
                            
                        </RowWrapper>
                    <LabelWrapper >Eggs Owned </LabelWrapper>
                    <RowWrapper >
                        <ValueWrapper >
                        0
                        </ValueWrapper>
                        <BorderButton >
                            Buy Eggs
                        </BorderButton>
                    </RowWrapper>
                    </Body>
            </Page>
        </>
    )
}

export default Account