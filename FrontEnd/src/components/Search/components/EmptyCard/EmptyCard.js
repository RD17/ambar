import React, { Component } from 'react'
import { Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import Paper from 'material-ui/Paper'

import classes from './EmptyCard.scss'

const EmptyCard = (props) => {
    const {title, textElement} = props

    return (
        <Paper zDepth={1} className={classes.emptyCard}>
            <Card>
                <CardHeader 
                    className={classes.emptyCardTitle}
                    title={<span className={classes.emptyCardHeaderTitle}>{title}</span>}
                />
                <CardText>
                    {textElement}                    
                </CardText>
            </Card>
        </Paper>
    )
}

EmptyCard.propTypes = {
    title: React.PropTypes.string.isRequired,
    textElement: React.PropTypes.object.isRequired
}

export default EmptyCard




