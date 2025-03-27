export class PaginationUtil {
	countTotalPages({
		totalItems,
		limit,
	}: {
		totalItems: number;
		limit: number;
	}): number {
		if (totalItems === 0 || limit === 0) {
			return 0;
		}

		return Math.ceil(totalItems / limit);
	}

	countOffset({ page = 1, limit }: { page: number; limit: number }): number {
		return (page - 1) * limit;
	}

	static countTotalPages({
		totalItems,
		limit,
	}: {
		totalItems: number;
		limit: number;
	}): number {
		return new PaginationUtil().countTotalPages({ totalItems, limit });
	}

	static countOffset({ page, limit }: { page: number; limit: number }): number {
		return new PaginationUtil().countOffset({ page, limit });
	}
}
