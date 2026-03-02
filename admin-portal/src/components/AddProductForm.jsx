import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Loader2,
  Upload,
  ImageIcon,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/products`;

const categories = [
  '',
  'Electronics',
  'Clothing',
  'Accessories',
  'Home & Garden',
  'Sports',
];

const initialForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
};

export default function AddProductForm({ onCancel, editProductId }) {
  const { token } = useAdminAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!editProductId;

  // Nếu đang edit, fetch dữ liệu sản phẩm
  useEffect(() => {
    if (editProductId) {
      setLoading(true);
      fetch(`${API_URL}/${editProductId}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            name: data.name || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            stock: data.stock?.toString() || '',
            category: data.category || '',
          });
          if (data.imageUrl) {
            setExistingImageUrl(data.imageUrl);
            setImagePreview(data.imageUrl);
          }
        })
        .catch(() => setServerError('Không thể tải thông tin sản phẩm'))
        .finally(() => setLoading(false));
    }
  }, [editProductId]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Ảnh không được vượt quá 5MB' }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(existingImageUrl || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Tên sản phẩm là bắt buộc';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Giá phải lớn hơn 0';
    if (form.stock !== '' && Number(form.stock) < 0) errs.stock = 'Số lượng không được âm';
    if (!form.category) errs.category = 'Vui lòng chọn danh mục';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    // Dùng FormData thay vì JSON
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', form.price);
    formData.append('stock', form.stock || '0');
    formData.append('category', form.category);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (existingImageUrl) {
      formData.append('imageUrl', existingImageUrl);
    }

    try {
      const url = isEditing ? `${API_URL}/${editProductId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Không set Content-Type — browser tự thêm multipart/form-data boundary
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      onCancel(); // Quay lại trang products
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 bg-slate-50 border ${
      errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
    } rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all`;

  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-4 flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <span className="ml-3 text-slate-500">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 mt-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {isEditing
              ? 'Update product information'
              : 'Add a new product to your inventory'}
          </p>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="glass rounded-2xl p-4 mb-6 border border-red-200 bg-red-50/50 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass rounded-2xl p-6 shadow-sm space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Enter product name"
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className={inputClass('description') + ' resize-none'}
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="0.00"
                className={inputClass('price')}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="0"
                className={inputClass('stock')}
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Category *
            </label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className={inputClass('category') + ' cursor-pointer'}
            >
              <option value="">Select a category</option>
              {categories
                .filter((c) => c)
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              Product Image
            </label>

            {/* Preview */}
            {imagePreview ? (
              <div className="relative w-full max-w-xs mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all mb-3"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ImageIcon size={24} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">Click to upload</p>
                  <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WebP up to 5MB</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
              >
                <Upload size={14} />
                Change Image
              </button>
            )}

            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {imageFile ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
