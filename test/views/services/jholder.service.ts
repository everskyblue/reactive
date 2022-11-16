import { adapterComments, adapterPost, adapterUser } from "../adapters/jsonplaceholder.adapter";
import { backendJsonplaceholder } from "./backend";
import { urlJsonPlaceholder } from "./urls";

export async function jpholderPost(concatUrl = '') {
    const response = await fetch(urlJsonPlaceholder.posts.concat(concatUrl));
    const data = await (response.json() as Promise<backendJsonplaceholder.TPost[]>);
    return data.map(post => adapterPost(post));
}

export async function jpholderComments(concatUrl = '') {
    const response = await fetch(urlJsonPlaceholder.comments.concat(concatUrl));
    const data = await (response.json() as Promise<backendJsonplaceholder.TComments[]>);
    return data.map(comment => adapterComments(comment));
}

export async function jpholderUsers(concatUrl = '') {
    const response = await fetch(urlJsonPlaceholder.users.concat(concatUrl));
    const data = await (response.json() as Promise<backendJsonplaceholder.TUser[]>);
    return data.map(user => adapterUser(user));
}
