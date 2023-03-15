export function mergeQuery(baseQuery = {}, rbacQuery = {}) {
    // coping value instead of refrence
    baseQuery = { ...baseQuery }
    rbacQuery = { ...rbacQuery }
    let query = {}

    if (Object.keys(rbacQuery).length === 0) return baseQuery
    if (Object.keys(baseQuery).length === 0) return rbacQuery

    Object.keys(baseQuery).forEach(key => {
        if (rbacQuery[key] == undefined) {
            let tempQuery = {}
            tempQuery[key] = baseQuery[key]
            query = mergeQuery(query, tempQuery)
    
        } else if (typeof baseQuery[key] == 'string' && typeof rbacQuery[key] == 'string') { // if both query values are string we use $in
            rbacQuery[key] = { $in: [rbacQuery[key], baseQuery[key] ] }
            query = mergeQuery(query, rbacQuery[key])

        } else { // if not same, we use $and
            let tempQuery = { $and: [] }

            let tempObj1 = {}
            tempObj1[key] = rbacQuery[key]
            tempQuery.$and.push(tempObj1)
            
            let tempObj2 = {}
            tempObj2[key] = baseQuery[key]
            tempQuery.$and.push(tempObj2)
            
            query = mergeQuery(query, tempQuery)
        }

        delete rbacQuery[key]
    })
    
    query = {...query, ...rbacQuery}

    return query 
}