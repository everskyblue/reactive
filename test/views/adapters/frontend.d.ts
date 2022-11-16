export namespace adapterJsonplaceholder {
    export type TComments = {
        uuid: number,
        id: number,
        name: string,
        email: string,
        body: string
    }
    
    export type TPost = {
        uuid: number,
        id: number,
        title: string,
        body: string
    }

    export type TUser = {
        id: number,
        name: string
        username: string
        email: string
    }
}