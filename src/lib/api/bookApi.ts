import { ENTRYPOINT } from '@/config/entrypoint';
import Book from '../types/Book';

const ENDPOINT = `books`;

export function getAll(pageId: string) {
    let page = parseInt(pageId);

    if (page < 1 || isNaN(page)) {
        page = 1;
    }

    return fetch(`${ENTRYPOINT}/${ENDPOINT}?page=${page}`).then(res => res.json());
};

export function update(data: Book): Promise<Response> {
    return fetch(
        `${ENTRYPOINT}${data['@id']}`,
        {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
    )
}

export function create(data: Book): Promise<Response> {
    return fetch(
        `${ENTRYPOINT}/${ENDPOINT}`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
    )
}

export function remove(data: Book): Promise<Response> {
    return fetch(
        `${ENTRYPOINT}${data['@id']}`,
        {
            method: 'DELETE',
        }
    )
}