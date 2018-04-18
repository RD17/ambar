import React from 'react'
import Paper from 'material-ui/Paper'
import { Card, CardText } from 'material-ui/Card'
import FullScreenPattern from '../FullScreenPattern'
import classes from './AuthPageTemplate.scss'

export const AuthPageTemplate = ({ children }) => (
  <FullScreenPattern>
    <Paper zDepth={5} style={{ backgroundColor: 'white' }}>
      <Card containerStyle={{ padding: 0, minWidth: '300px' }}>
        <CardText style={{ display: 'flex', justifyContent: 'center', paddingBottom: '0' }}>
          <a href='https://ambar.cloud' target='_blank'><img height={100} src='owl-green.svg' alt='logo' /></a>
        </CardText>
        {children}
      </Card>
    </Paper>
  </FullScreenPattern>
)

export default AuthPageTemplate
