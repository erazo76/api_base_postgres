/**
 * confing sftp connection model
 */
export interface Config {
    host: string, // string Hostname or IP of server.
    port?: string | number, // Port number of the server.
    username: string, // string Username for authentication.
    privateKey?: Buffer | string, // Buffer or string that contains
    password?: string // string - For an encrypted private key
}