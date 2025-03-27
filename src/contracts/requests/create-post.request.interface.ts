export interface ICreatePostRequest {
	postContent: string;
	postPrice: number;
	bookTitle: string;
	bookAuthor: string;
	bookPublisher?: string;
	bookPublishYear?: string;
	bookISBN?: string;
	bookLanguage?: string;
}
