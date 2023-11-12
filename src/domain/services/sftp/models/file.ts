/**
 * sftp file management model
 */
export interface FileSftp {
    type: string; // file type(-, d, l)
    name: string; // file name
    size: number | string; // file size
    modifyTime: number; // file timestamp of modified time
    accessTime: number; // file timestamp of access time
    rights: {
        user: string; // user ID
        group: string; // user ID
        other: any; // 
    }
}