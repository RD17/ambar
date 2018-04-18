const map = new WeakMap
const wm = (o) => map.get(o)

function normalizeValue([value, filename]) {
  if (value instanceof Blob)
    value = new File([value], filename, {
      type: value.type,
      lastModified: value.lastModified
    })

  return value
}

function stringify(name) {
  if (!arguments.length) 
    throw new TypeError('1 argument required, but only 0 present.')

  return [name + '']
}

function normalizeArgs(name, value, filename) {
  if (arguments.length < 2) 
    throw new TypeError(`2 arguments required, but only ${arguments.length} present.`)
    
  return value instanceof Blob 
    ? [name + '', value, filename !== undefined 
      ? filename + '' 
      : value[Symbol.toStringTag] === 'File'
        ? value.name 
        : 'Blob']
    : [name + '', value + '']
}

/**
 * @implements {Iterable}
 */
class FormDataPolyfill {

  /**
   * FormData class
   *
   * @param {HTMLElement=} form
   */
  constructor(form) {
    map.set(this, Object.create(null))

    if (!form)
      return this

    for (let {name, type, value, files, checked, selectedOptions} of Array.from(form.elements)) {
      if(!name) continue

      if (type === 'file')
        for (let file of files)
          this.append(name, file)
      else if (type === 'select-multiple' || type === 'select-one')
        for (let elm of selectedOptions)
          this.append(name, elm.value)
      else if (type === 'checkbox')
        if (checked) this.append(name, value)
      else
        this.append(name, value)
    }
  }


  /**
   * Append a field
   *
   * @param   {String}           name      field name
   * @param   {String|Blob|File} value     string / blob / file
   * @param   {String=}          filename  filename to use with blob
   * @return  {Undefined}
   */
  append(name, value, filename) {
    let map = wm(this)

    if (!map[name])
      map[name] = []

    map[name].push([value, filename])
  }


  /**
   * Delete all fields values given name
   *
   * @param   {String}  name  Field name
   * @return  {Undefined}
   */
  delete(name) {
    delete wm(this)[name]
  }


  /**
   * Iterate over all fields as [name, value]
   *
   * @return {Iterator}
   */
  *entries() {
    let map = wm(this)

    for (let name in map)
      for (let value of map[name])
        yield [name, normalizeValue(value)]
  }

  /**
   * Iterate over all fields
   *
   * @param   {Function}  callback  Executed for each item with parameters (value, name, thisArg)
   * @param   {Object=}   thisArg   `this` context for callback function
   * @return  {Undefined}
   */
  forEach(callback, thisArg) {
    for (let [name, value] of this)
      callback.call(thisArg, value, name, this)
  }


  /**
   * Return first field value given name
   *
   * @param   {String}  name  Field name
   * @return  {String|File}   value Fields value
   */
  get(name) {
    let map = wm(this)
    return map[name] ? normalizeValue(map[name][0]) : null
  }


  /**
   * Return all fields values given name
   *
   * @param   {String}  name  Fields name
   * @return  {Array}         [value, value]
   */
  getAll(name) {
    return (wm(this)[name] || []).map(normalizeValue)
  }


  /**
   * Check for field name existence
   *
   * @param   {String}   name  Field name
   * @return  {boolean}
   */
  has(name) {
    return name in wm(this)
  }
  

  /**
   * Iterate over all fields name
   *
   * @return {Iterator}
   */
  *keys() {
    for (let [name] of this)
      yield name
  }


  /**
   * Overwrite all values given name
   *
   * @param   {String}    name      Filed name
   * @param   {String}    value     Field value
   * @param   {String=}   filename  Filename (optional)
   * @return  {Undefined}
   */
  set(name, value, filename) {
    wm(this)[name] = [[value, filename]]
  }


  /**
   * Iterate over all fields
   *
   * @return {Iterator}
   */
  *values() {
    for (let [name, value] of this)
      yield value
  }


  /**
   * Non standard but it has been proposed: https://github.com/w3c/FileAPI/issues/40
   *
   * @return {ReadableStream}
   */
  stream() {
    try {
      return this._blob().stream()
    } catch(e) {
      throw new Error('Include https://github.com/jimmywarting/Screw-FileReader for streaming support')
    }
  }


  /**
   * Return a native (perhaps degraded) FormData with only a `append` method
   * Can throw if it's not supported
   *
   * @return {FormData}
   */
  _asNative() {
    let fd = new FormData

    for (let [name, value] of this)
      fd.append(name, value)

    return fd
  }


  /**
   * [_blob description]
   *
   * @return {Blob} [description]
   */
  _blob() {
    var boundary = '----formdata-polyfill-' + Math.random()
    var chunks = []

    for (let [name, value] of this) {
      chunks.push(`--${boundary}\r\n`)

      if (value[Symbol.toStringTag] === 'File') {
        chunks.push(
          `Content-Disposition: form-data; name="${name}"; filename="${value.name}"\r\n`,
          `Content-Type: ${value.type}\r\n\r\n`,
          value,
          '\r\n'
        )
      } else {
        chunks.push(
          `Content-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
        )
      }
    }

    chunks.push(`--${boundary}--`)

    return new Blob(chunks, {type: 'multipart/form-data; boundary=' + boundary})
  }


  /**
   * The class itself is iterable
   * alias for formdata.entries()
   *
   * @return  {Iterator}
   */
  [Symbol.iterator]() {
    return this.entries()
  }


  /**
   * Create the default string description.
   * It is accessed internally by the Object.prototype.toString().
   *
   * @return {String} FormData
   */
  get [Symbol.toStringTag]() {
    return 'FormData'
  }
}

for (let [method, overide] of [
  ['append', normalizeArgs],
  ['delete', stringify],
  ['get',    stringify],
  ['getAll', stringify],
  ['has',    stringify],
  ['set',    normalizeArgs]
]) {
  let orig = FormDataPolyfill.prototype[method]
  FormDataPolyfill.prototype[method] = function() {
    return orig.apply(this, overide(...arguments))
  }
}

export default FormDataPolyfill