import React, { Component } from 'react'
import { PieChart, Pie, Tooltip, Cell } from 'recharts'
import classes from './ExtensionsPieChart.scss'

const colors = ['#B2EBF2','#80DEEA','#4DD0E1','#26C6DA','#00BCD4','#00ACC1','#0097A7','#00838F']
const otherColor = '#DCE775'

const DEFAULT_ON_CLICK = () => { }

class ExtensionsPieChart extends Component {
    render() {        
        const { data, onClick = DEFAULT_ON_CLICK } = this.props

        return (
                <PieChart width={450} height={250} margin={{top: 35, right: 25, bottom: 35, left: 25}}>
                    <Pie 
                        onClick={(e) => onClick(e.name)}
                        isAnimationActive={false}
                        data={data} 
                        dataKey={'hits_count'}
                        nameKey={'extension'}
                        outerRadius='100%'  
                        innerRadius='50%'    
                        labelLine={false}
                        label={(node) => node.extension}                             
                        cx='50%'
                        cy='50%'
                        >     
                        { data.map((entry, index) => 
                            <Cell 
                                cursor='hand' 
                                key={index} 
                                fill={entry.extension === 'Others' ? otherColor : colors[index % colors.length]}/>) }
                    </Pie>
                    <Tooltip />
                </PieChart>)
    }
}

ExtensionsPieChart.propTypes = {
    data: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func
}

export default ExtensionsPieChart