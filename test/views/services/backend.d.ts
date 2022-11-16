export namespace backendJsonplaceholder {
    export type TComments = {
        postId: number,
        id: number,
        name: string,
        email: string,
        body: string
    }

    export type TPost = {
        userId: number,
        id: number,
        title: string,
        body: string
    }

    export type TUserAddress = {

        street: string,
        suite: string,
        city: string,
        zipcode: number,
        geo: TUserGeolocation
    }

    export type TUserCompany = {
        name: string,
        catchPhrase: string,
        bs: string
    }

    export type TUserGeolocation = {
        lat: number,
        lng: number
    }

    export type TUser = {
        id: number,
        name: string
        username: string
        email: string,
        address: TUserAddress,
        phone: number,
        website: string,
        company: TUserCompany
    }
}