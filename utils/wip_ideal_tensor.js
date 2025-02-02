import { torch } from "../imports.js"

export const tensorInterfaceV1 = Symbol("tensorInterface")

const product = (array)=>{
    let result = 1
    for (let each of array) {
        result *= each
    }
    return result
}

// export const TensorV1 = {
//     at(self, index) {
//         return self.at(index)
//     },
//     add(...tensors) {
//         return self.add(other)
//     },
//     broadcast(self, other) {
//         return self.broadcast(other)
//     },
//     div
//     exp
//     shape
//     length
//     log
//     maskedFill
//     matmul
//     mul
//     neg
//     pow
//     reshape
//     shape
//     sqrt
//     sub
//     sum
//     toArrays
//     transpose
//     mean
//     variance
// }
export class TensorInterfaceV1 {
    // static operations = {

    // }
    get shape() {
        // return a copy, not a frozen array or cached value
        return []
    }
    get length() {
        return this.shape[0]
    }

    maskedFill() {
    }
    reshape(newShape) {
        // handle -1 to infer the size
        for (let index; index < newShape.length; index++) {
            if (newShape[index] == -1) {
                const necessaryProduct = product(this.shape)
                const currentProduct = product(newShape.splice(index, 1))
                const missingValue = necessaryProduct / currentProduct
                if (missingValue <= 0) {
                    throw Error(`Reshape error: cannot reshape ${this.shape} to ${newShape}, the current shape has a product of ${necessaryProduct} and the new shape has a product of ${currentProduct}\nThe -1 would need to be ${missingValue} to make the reshape work, which is not valid`)
                }
                newShape[index] = missingValue
            }
        }
        // works with -1 to infer the size
    }
    flatten(depth) {
        if (depth == null) {
            return this.reshape([-1])
        } else {
            const shape = this.shape
            shape.splice(0, depth, -1)
            return this.reshape(shape)
        }
    }
    neg() {
    }
    pow() {
    }
    sqrt() {
    }
    abs() {
    }
    sum(dims) {
    }
    product(dims) {
    }
    mean(dims) {
    }
    variance(dims) {
    }
    transpose(dims) {
    }
    toArray() {
    }
    add(other) {
        // other must be scalar or of exact same shape
    }
    sub(other) {
        // other must be scalar or of exact same shape
    }
    dot(other) {
        // other must be scalar or of exact same shape
    }
    div(other) {
        // other must be scalar or of exact same shape
    }
    exp(other) {
        // other must be scalar or of exact same shape
    }
    log(other) {
        // other must be scalar or of exact same shape
    }
    broadcast() {
    }
    cross(other) {
        // other must be compatible shape (no broadcast)
    }
}

// actual pytorch stuff:
    // b.abs(
    // b.absolute(
    // b.acos(
    // b.acosh(
    // b.add(
    // b.addbmm(
    // b.addcdiv(
    // b.addcmul(
    // b.addmm(
    // b.addmv(
    // b.addr(
    // b.adjoint(
    // b.align_as(
    // b.align_to(
    // b.all(
    // b.allclose(
    // b.amax(
    // b.amin(
    // b.aminmax(
    // b.angle(
    // b.any(
    // b.arccos(
    // b.arccosh(
    // b.arcsin(
    // b.arcsinh(
    // b.arctan(
    // b.arctan2(
    // b.arctanh(
    // b.argmax(
    // b.argmin(
    // b.argsort(
    // b.argwhere(
    // b.as_strided_scatter(
    // b.as_strided(
    // b.as_subclass(
    // b.asin(
    // b.asinh(
    // b.atan(
    // b.atan2(
    // b.atanh(
    // b.backward(
    // b.baddbmm(
    // b.bernoulli(
    // b.bfloat16(
    // b.bincount(
    // b.bitwise_and(
    // b.bitwise_left_shift(
    // b.bitwise_not(
    // b.bitwise_or(
    // b.bitwise_right_shift(
    // b.bitwise_xor(
    // b.bmm(
    // b.bool(
    // b.broadcast_to(
    // b.byte(
    // b.ccol_indices(
    // b.cdouble(
    // b.ceil(
    // b.cfloat(
    // b.chalf(
    // b.char(
    // b.cholesky_inverse(
    // b.cholesky_solve(
    // b.cholesky(
    // b.chunk(
    // b.clamp_max(
    // b.clamp_min(
    // b.clamp(
    // b.clip(
    // b.clone(
    // b.coalesce(
    // b.col_indices(
    // b.conj_physical(
    // b.conj(
    // b.contiguous(
    // b.copysign(
    // b.corrcoef(
    // b.cos(
    // b.cosh(
    // b.count_nonzero(
    // b.cov(
    // b.cpu(
    // b.cross(
    // b.crow_indices(
    // b.cuda(
    // b.cummax(
    // b.cummin(
    // b.cumprod(
    // b.cumsum(
    // b.data
    // b.data_ptr(
    // b.deg2rad(
    // b.dense_dim(
    // b.dequantize(
    // b.det(
    // b.detach(
    // b.device
    // b.diag_embed(
    // b.diag(
    // b.diagflat(
    // b.diagonal_scatter(
    // b.diagonal(
    // b.diff(
    // b.digamma(
    // b.dim_order(
    // b.dim(
    // b.dist(
    // b.div(
    // b.divide(
    // b.dot(
    // b.double(
    // b.dsplit(
    // b.dtype
    // b.eig(
    // b.element_size(
    // b.eq(
    // b.equal(
    // b.erf(
    // b.erfc(
    // b.erfinv(
    // b.exp(
    // b.exp2(
    // b.expand_as(
    // b.expand(
    // b.expm1(
    // b.fix(
    // b.flatten(
    // b.flip(
    // b.fliplr(
    // b.flipud(
    // b.float_power(
    // b.float(
    // b.floor_divide(
    // b.floor(
    // b.fmax(
    // b.fmin(
    // b.fmod(
    // b.frac(
    // b.frexp(
    // b.gather(
    // b.gcd(
    // b.ge(
    // b.geqrf(
    // b.ger(
    // b.get_device(
    // b.grad
    // b.grad_fn
    // b.greater_equal(
    // b.greater(
    // b.gt(
    // b.H
    // b.half(
    // b.hardshrink(
    // b.has_names(
    // b.heaviside(
    // b.histc(
    // b.histogram(
    // b.hsplit(
    // b.hypot(
    // b.i0(
    // b.igamma(
    // b.igammac(
    // b.imag
    // b.index_add(
    // b.index_copy(
    // b.index_fill(
    // b.index_put(
    // b.index_reduce(
    // b.index_select(
    // b.indices(
    // b.inner(
    // b.int_repr(
    // b.int(
    // b.inverse(
    // b.ipu(
    // b.is_coalesced(
    // b.is_complex(
    // b.is_conj(
    // b.is_contiguous(
    // b.is_cpu
    // b.is_cuda
    // b.is_distributed(
    // b.is_floating_point(
    // b.is_inference(
    // b.is_ipu
    // b.is_leaf
    // b.is_meta
    // b.is_mkldnn
    // b.is_mps
    // b.is_mtia
    // b.is_neg(
    // b.is_nested
    // b.is_nonzero(
    // b.is_ort
    // b.is_pinned(
    // b.is_quantized
    // b.is_same_size(
    // b.is_set_to(
    // b.is_shared(
    // b.is_signed(
    // b.is_sparse
    // b.is_sparse_csr
    // b.is_vulkan
    // b.is_xla
    // b.is_xpu
    // b.isclose(
    // b.isfinite(
    // b.isinf(
    // b.isnan(
    // b.isneginf(
    // b.isposinf(
    // b.isreal(
    // b.istft(
    // b.item(
    // b.itemsize
    // b.kron(
    // b.kthvalue(
    // b.layout
    // b.lcm(
    // b.ldexp(
    // b.le(
    // b.lerp(
    // b.less_equal(
    // b.less(
    // b.lgamma(
    // b.log_softmax(
    // b.log(
    // b.log10(
    // b.log1p(
    // b.log2(
    // b.logaddexp(
    // b.logaddexp2(
    // b.logcumsumexp(
    // b.logdet(
    // b.logical_and(
    // b.logical_not(
    // b.logical_or(
    // b.logical_xor(
    // b.logit(
    // b.logsumexp(
    // b.long(
    // b.lstsq(
    // b.lt(
    // b.lu_solve(
    // b.lu(
    // b.masked_fill(
    // b.masked_scatter(
    // b.masked_select(
    // b.matmul(
    // b.matrix_exp(
    // b.matrix_power(
    // b.max(
    // b.maximum(
    // b.mean(
    // b.median(
    // b.mH
    // b.min(
    // b.minimum(
    // b.mm(
    // b.mode(
    // b.moveaxis(
    // b.movedim(
    // b.msort(
    // b.mT
    // b.mul(
    // b.multinomial(
    // b.multiply(
    // b.mv(
    // b.mvlgamma(
    // b.name
    // b.names
    // b.nan_to_num(
    // b.nanmean(
    // b.nanmedian(
    // b.nanquantile(
    // b.nansum(
    // b.narrow_copy(
    // b.narrow(
    // b.nbytes
    // b.ndim
    // b.ndimension(
    // b.ne(
    // b.neg(
    // b.negative(
    // b.nelement(
    // b.new_empty_strided(
    // b.new_empty(
    // b.new_full(
    // b.new_ones(
    // b.new_tensor(
    // b.new_zeros(
    // b.new(
    // b.nextafter(
    // b.nonzero_static(
    // b.nonzero(
    // b.norm(
    // b.not_equal(
    // b.numel(
    // b.numpy(
    // b.orgqr(
    // b.ormqr(
    // b.outer(
    // b.output_nr
    // b.permute(
    // b.pin_memory(
    // b.pinverse(
    // b.polygamma(
    // b.positive(
    // b.pow(
    // b.prelu(
    // b.prod(
    // b.put(
    // b.q_per_channel_axis(
    // b.q_per_channel_scales(
    // b.q_per_channel_zero_points(
    // b.q_scale(
    // b.q_zero_point(
    // b.qr(
    // b.qscheme(
    // b.quantile(
    // b.rad2deg(
    // b.ravel(
    // b.real
    // b.reciprocal(
    // b.record_stream(
    // b.refine_names(
    // b.register_hook(
    // b.register_post_accumulate_grad_hook(
    // b.reinforce(
    // b.relu(
    // b.remainder(
    // b.rename(
    // b.renorm(
    // b.repeat_interleave(
    // b.repeat(
    // b.requires_grad
    // b.reshape_as(
    // b.reshape(
    // b.resize_as(
    // b.resize(
    // b.resolve_conj(
    // b.resolve_neg(
    // b.retain_grad(
    // b.retains_grad
    // b.roll(
    // b.rot90(
    // b.round(
    // b.row_indices(
    // b.rsqrt(
    // b.scatter_add(
    // b.scatter_reduce(
    // b.scatter(
    // b.select_scatter(
    // b.select(
    // b.sgn(
    // b.shape
    // b.short(
    // b.sigmoid(
    // b.sign(
    // b.signbit(
    // b.sin(
    // b.sinc(
    // b.sinh(
    // b.size(
    // b.slice_scatter(
    // b.slogdet(
    // b.smm(
    // b.softmax(
    // b.solve(
    // b.sort(
    // b.sparse_dim(
    // b.sparse_mask(
    // b.split_with_sizes(
    // b.split(
    // b.sqrt(
    // b.square(
    // b.squeeze(
    // b.sspaddmm(
    // b.std(
    // b.stft(
    // b.storage_offset(
    // b.storage_type(
    // b.storage(
    // b.stride(
    // b.sub(
    // b.subtract(
    // b.sum_to_size(
    // b.sum(
    // b.svd(
    // b.swapaxes(
    // b.swapdims(
    // b.symeig(
    // b.T
    // b.t(
    // b.take_along_dim(
    // b.take(
    // b.tan(
    // b.tanh(
    // b.tensor_split(
    // b.tile(
    // b.to_dense(
    // b.to_mkldnn(
    // b.to_padded_tensor(
    // b.to_sparse_bsc(
    // b.to_sparse_bsr(
    // b.to_sparse_coo(
    // b.to_sparse_csc(
    // b.to_sparse_csr(
    // b.to_sparse(
    // b.to(
    // b.tolist(
    // b.topk(
    // b.trace(
    // b.transpose(
    // b.triangular_solve(
    // b.tril(
    // b.triu(
    // b.true_divide(
    // b.trunc(
    // b.type_as(
    // b.type(
    // b.unbind(
    // b.unflatten(
    // b.unfold(
    // b.unique_consecutive(
    // b.unique(
    // b.unsafe_chunk(
    // b.unsafe_split_with_sizes(
    // b.unsafe_split(
    // b.unsqueeze(
    // b.untyped_storage(
    // b.values(
    // b.var(
    // b.vdot(
    // b.view_as(
    // b.view(
    // b.volatile
    // b.vsplit(
    // b.where(
    // b.xlogy(
    // b.xpu(