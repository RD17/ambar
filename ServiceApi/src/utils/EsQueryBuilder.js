const MAX_TAGS_TO_RETRIEVE = 100

/////////////////////////////////////// Index Name /////////////////////////////////////////////////////////
const ES_FILE_INDEX_NAME = "ambar_file_data"

export const AMBAR_FILE_INDEX_PREFIX = `${ES_FILE_INDEX_NAME}_`

/////////////////////////////////////// Tags queries ///////////////////////////////////////////////////////

export const getTagsStatsQuery = () => (
    {
        from: 0,
        size: 0,
        aggs: {
            tags: {
                terms: { field: 'name', size: MAX_TAGS_TO_RETRIEVE },
                aggs: { type: { terms: { field: 'type' } } }
            }
        }
    })
