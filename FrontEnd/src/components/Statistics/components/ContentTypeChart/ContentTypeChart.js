import React, { Component } from 'react'
import { PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer } from 'recharts'
// import classes from './ContentTypeChart.scss'

const minTresholdInPercents = 0.05
const colors = ['#B2EBF2','#80DEEA','#4DD0E1','#26C6DA','#00BCD4','#00ACC1','#0097A7','#00838F']
const otherColor = '#DCE775'

const renderCustomizedLabel = (minThreshold) => ({name, value, percent}) => {      
    if (minThreshold > value) {
        return undefined
    }
    return name
}

class ContentTypeChart extends Component {
    render() {        
        const {data, minThreshold, total} = this.props.data

        const filteredData = data.filter(item => item.value >= minThreshold)

        const otherDataSum = data
            .filter(item => item.value < minThreshold)
            .map(item => item.value)
            .reduce((a, b) => (a + b), 0)

        filteredData.push({name: 'Other', value: otherDataSum})

        return (
            <ResponsiveContainer aspect={2}>
                <PieChart>
                    <Pie 
                        isAnimationActive={false}
                        data={filteredData} 
                        outerRadius='100%'  
                        innerRadius='40%'                     
                        cx='50%'
                        labelLine={false}
                        >                        
                        { filteredData.map((entry, index) => <Cell key={index} fill={entry.name === 'Other' ? otherColor : colors[index % colors.length]}/>) }
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>)
    }
}

ContentTypeChart.propTypes = {
    data: React.PropTypes.object.isRequired
}

export default ContentTypeChart