// create a error   
export const createError=(status,msg)=>{
    const err=new Error()
    err.message=msg
    err.status=status
    return err
}
