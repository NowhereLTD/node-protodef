import * as conditional from "../../ProtoDef/schemas/conditional.json" assert { type: "json" };
import { getField, getFieldInfo, tryDoc, PartialReadError } from "../utils.js";

function readSwitch (buffer, offset, { compareTo, fields, compareToValue, default: defVal }, rootNode) {
  compareTo = compareToValue !== undefined ? compareToValue : getField(compareTo, rootNode)
  if (typeof fields[compareTo] === 'undefined' && typeof defVal === 'undefined') { throw new Error(compareTo + ' has no associated fieldInfo in switch') }
  for (const field in fields) {
    if (field.startsWith('/')) {
      fields[this.types[field.slice(1)]] = fields[field]
      delete fields[field]
    }
  }
  const caseDefault = typeof fields[compareTo] === 'undefined'
  const resultingType = caseDefault ? defVal : fields[compareTo]
  const fieldInfo = getFieldInfo(resultingType)
  return tryDoc(() => this.read(buffer, offset, fieldInfo, rootNode), caseDefault ? 'default' : compareTo)
}

function writeSwitch (value, buffer, offset, { compareTo, fields, compareToValue, default: defVal }, rootNode) {
  compareTo = compareToValue !== undefined ? compareToValue : getField(compareTo, rootNode)
  if (typeof fields[compareTo] === 'undefined' && typeof defVal === 'undefined') { throw new Error(compareTo + ' has no associated fieldInfo in switch') }
  for (const field in fields) {
    if (field.startsWith('/')) {
      fields[this.types[field.slice(1)]] = fields[field]
      delete fields[field]
    }
  }
  const caseDefault = typeof fields[compareTo] === 'undefined'
  const fieldInfo = getFieldInfo(caseDefault ? defVal : fields[compareTo])
  return tryDoc(() => this.write(value, buffer, offset, fieldInfo, rootNode), caseDefault ? 'default' : compareTo)
}

function sizeOfSwitch (value, { compareTo, fields, compareToValue, default: defVal }, rootNode) {
  compareTo = compareToValue !== undefined ? compareToValue : getField(compareTo, rootNode)
  if (typeof fields[compareTo] === 'undefined' && typeof defVal === 'undefined') { throw new Error(compareTo + ' has no associated fieldInfo in switch') }
  for (const field in fields) {
    if (field.startsWith('/')) {
      fields[this.types[field.slice(1)]] = fields[field]
      delete fields[field]
    }
  }
  const caseDefault = typeof fields[compareTo] === 'undefined'
  const fieldInfo = getFieldInfo(caseDefault ? defVal : fields[compareTo])
  return tryDoc(() => this.sizeOf(value, fieldInfo, rootNode), caseDefault ? 'default' : compareTo)
}

function readOption (buffer, offset, typeArgs, context) {
  if (buffer.length < offset + 1) { throw new PartialReadError() }
  const val = buffer.readUInt8(offset++)
  if (val !== 0) {
    const retval = this.read(buffer, offset, typeArgs, context)
    retval.size++
    return retval
  } else { return { size: 1 } }
}

function writeOption (value, buffer, offset, typeArgs, context) {
  if (value != null) {
    buffer.writeUInt8(1, offset++)
    offset = this.write(value, buffer, offset, typeArgs, context)
  } else { buffer.writeUInt8(0, offset++) }
  return offset
}

function sizeOfOption (value, typeArgs, context) {
  return value == null ? 1 : this.sizeOf(value, typeArgs, context) + 1
}

const switchData = [readSwitch, writeSwitch, sizeOfSwitch, conditional.switch];
const option = [readOption, writeOption, sizeOfOption, conditional.option];

export {
  switchData as switch,
  option
}
