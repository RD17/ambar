import React, { Component } from 'react'

import PipelineCard from './components/PipelineCard'
import classes from './Settings.scss'

class Settings extends Component {
    componentDidMount() {
        const {
            loadPipelineLog,
            pipeline,
            setPageTitle,
            setAppHeader,
            localization
        } = this.props

        setPageTitle(localization.settingsPage.pageTitle)
        setAppHeader({ left: () => localization.settingsPage.pageTitle })
        loadPipelineLog(pipeline)
    }

    render() {
        const {
            fetching,
            crawlers,
            startStopCrawler,
            setSettingsModalOpen,
            refreshCrawler,
            pipeline,
            loadPipelineLog,
            localization } = this.props

        return (
            <div className='pageContainer'>
                {!fetching &&
                    <PipelineCard 
                        pipeline={pipeline}
                        loadPipelineLog={loadPipelineLog}
                        localization={localization}
                     />
                }                
            </div>
        )
    }
}

Settings.propTypes = {
    fetching: React.PropTypes.bool.isRequired,
    pipeline: React.PropTypes.object.isRequired,
    loadPipelineLog: React.PropTypes.func.isRequired,
    setPageTitle: React.PropTypes.func.isRequired,    
    localization: React.PropTypes.object.isRequired
}

export default Settings