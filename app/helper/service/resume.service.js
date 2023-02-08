
const setProccessDuration = async (resume) => {
    if (resume.status == 'rejected' || resume.status == 'hired') {
        let createdAtTimeStamp = Math.floor((new Date(resume.createdAt).getTime()) / 1000)
        let rejectedOrHiredTimeStamp = Math.floor((new Date().getTime()) / 1000)
        let processDuration = rejectedOrHiredTimeStamp - createdAtTimeStamp;
        resume.process_duration = processDuration;
        await resume.save();
    }
}

export { setProccessDuration }