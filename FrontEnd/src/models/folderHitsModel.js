import moment from 'moment'
import { dates, urls } from 'utils/'

export const fromApi = (resp) => {
    const transformModelToView = (hit) => ({
        path: hit.path,
        name: hit.name,
        type: hit.type,
        childNodes: hit.children.map(child => transformModelToView(child)),
        hitsCount: hit.hits_count,
        isExpanded: false,
        depth: hit.depth,
        parentPath: hit.parent_path,
        thumbAvailable: hit.thumb_available,
        contentType: hit.content_type,
        sha256: hit.sha256,
        fileId: hit.file_id,
    })

    return resp.tree.map(node => transformModelToView(node))
}
