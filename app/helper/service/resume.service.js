const endOfResumeStatus = ['rejected', 'hired'];

const setProccessDuration = async(resume) => {
    if (endOfResumeStatus.includes(resume.status)) {
        let createdAtTimeStamp = Math.floor(new Date(resume.createdAt).getTime() / 1000, )
        let rejectedOrHiredTimeStamp = Math.floor(new Date().getTime() / 1000)
        let processDuration = rejectedOrHiredTimeStamp - createdAtTimeStamp
        resume.process_duration = processDuration
        await resume.save()
    }
}

export { setProccessDuration }