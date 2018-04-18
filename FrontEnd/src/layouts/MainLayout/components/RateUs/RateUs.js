import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import FacebookIcon from './assets/facebook.svg'
import GithubIcon from './assets/github.svg'
import TwitterIcon from './assets/twitter.svg'

import classes from './RateUs.scss'

class RateUs extends Component {
    constructor() {
        super()
    }

    render() {
        const { isOpen, toggle } = this.props

        const goToUrl = (url) => {
            window.open(url)
        }

        return (
            <div className={classes.stampIconContainer}>
                <img className={classes.stampIcon} src='./stamp-icon.png' width='48' height='48' title='Rate Us' onClick={() => toggle(true)} />
                <Dialog
                    title="Thanks for choosing Ambar!"
                    open={isOpen}
                    actionsContainerStyle={{ textAlign: 'center' }}
                    onRequestClose={() => toggle(false)}
                >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginRight: '20px' }}>
                            <img style={{ maxHeight: '250px' }} src='/rate-us-owl.gif' alt='Rate Us' />
                        </div>
                        <div className={classes.rateUsText}>
                            <p>
                                Let's spread the word that Ambar is awesome! Help us make Ambar even better, follow us on Twitter or give us your stars on Github.
                            </p>
                            <p>
                                Together we will build the best document search system in the world!
                            </p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <FlatButton
                                    label="Star"
                                    primary={true}
                                    onTouchTap={() => goToUrl('https://github.com/RD17/ambar')}
                                    icon={<img height={20} src={GithubIcon} />}
                                />
                                <FlatButton
                                    label="Tweet"
                                    primary={true}
                                    onTouchTap={() => goToUrl('https://twitter.com/intent/tweet?text=%23Ambar%20is%20awesome%20%23DocumentSearchSystem!%20Check%20it%20out%20on%20https%3A%2F%2Fambar.cloud')}
                                    icon={<img height={20} src={TwitterIcon} />}
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}

RateUs.propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    toggle: React.PropTypes.func.isRequired
}

export default RateUs
