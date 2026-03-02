import { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Image,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSearch } from '../context/SearchContext';
import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Accessories',
  'Home & Garden',
  'Sports',
];

const ITEMS_PER_PAGE = 6;

const categoryColors = {
  Electronics: 'bg-blue-50 text-blue-600',
  Clothing: 'bg-pink-50 text-pink-600',
  Accessories: 'bg-violet-50 text-violet-600',
  'Home & Garden': 'bg-emerald-50 text-emerald-600',
  Sports: 'bg-amber-50 text-amber-600',
};

export default function ProductsPage({ onNavigate }) {
  const { token } = useAdminAuth();
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch products từ API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Không thể tải sản phẩm');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Xóa thất bại');
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Filter products (dùng global search)
  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  // Reset page khi search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-4">
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-primary-500" />
          <span className="ml-3 text-slate-500">Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass rounded-2xl p-8 text-center">
          <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 mt-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your product inventory and listings ({products.length} products)
          </p>
        </div>
        <button
          onClick={() => onNavigate('add-product')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98]"
          id="add-product-btn"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Category Filter */}
      <div className="glass rounded-2xl p-4 mb-6 shadow-sm flex items-center gap-3">
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all cursor-pointer"
            id="category-filter"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronRight
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-400">
            Searching: <span className="font-semibold text-slate-600">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Product Table */}
      <div className="glass rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full" id="products-table">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map((product, idx) => (
                <tr
                  key={product._id}
                  className={`table-row-hover ${
                    idx % 2 === 1 ? 'bg-slate-50/50' : ''
                  }`}
                >
                  {/* Product Name + Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {product.imageUrl &&
                        !product.imageUrl.includes('placeholder') ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <Image
                            size={18}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700 line-clamp-1">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        categoryColors[product.category] ||
                        'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {product.category}
                    </span>
                  </td>
                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  {/* Stock */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? 'text-red-500'
                            : product.stock < 20
                            ? 'text-amber-500'
                            : 'text-slate-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock === 0 && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded-md uppercase">
                          Out
                        </span>
                      )}
                      {product.stock > 0 && product.stock < 20 && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-500 text-[10px] font-bold rounded-md uppercase">
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          onNavigate(`edit-product:${product._id}`)
                        }
                        className="p-2 rounded-lg text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(product)}
                        className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Package
                      size={40}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="text-sm font-medium text-slate-400">
                      No products found
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Try adjusting your search or filter
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Showing{' '}
              <span className="font-semibold text-slate-600">
                {(page - 1) * ITEMS_PER_PAGE + 1}
              </span>
              –
              <span className="font-semibold text-slate-600">
                {Math.min(page * ITEMS_PER_PAGE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-600">
                {filtered.length}
              </span>{' '}
              products
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      num === page
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Xác nhận xóa
              </h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa sản phẩm{' '}
              <span className="font-semibold text-slate-700">
                "{deleteModal.name}"
              </span>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteModal._id)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
