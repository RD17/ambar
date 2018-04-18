import React, { Component } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// import classes from './ProcessingRateChart.scss'

const colors = ['#80DEEA','#4DD0E1','#26C6DA','#00BCD4','#00ACC1','#0097A7','#00838F']

const renderCustomizedLabel = ({ name, value, percent }) => {
    return `${name} (${(percent * 100).toFixed(0)}%)`
}

class ProcessingRateChart extends Component {
    render() {
        const { data, names } = this.props.data

        return (
            <ResponsiveContainer aspect={2} >
                <AreaChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    {Array.from(names).map((name, idx) =>
                        (<Area
                            isAnimationActive={false}
                            key={idx}
                            type='monotone'
                            dataKey={name}
                            stackId="1"
                            stroke={colors[idx % colors.length]}
                            fill={colors[idx % colors.length]}
                        />)
                    )
                    }
                </AreaChart>
            </ResponsiveContainer>
        )
    }
}

ProcessingRateChart.propTypes = {
    data: React.PropTypes.object.isRequired
}

export default ProcessingRateChart