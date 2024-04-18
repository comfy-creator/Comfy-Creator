/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Struct } from "./google/protobuf/struct";

export const protobufPackage = "serialized_graph";

export interface Position {
  x: number;
  y: number;
}

export interface Input {
  name: string;
  type: string;
  optional: boolean;
}

export interface Output {
  name: string;
  type: string;
}

export interface Widget {
  name: string;
  optional: boolean;
  type: string;
  /** varies widely */
  value: { [key: string]: any } | undefined;
}

export interface Widgets {
  items: { [key: string]: Widget };
}

export interface Widgets_ItemsEntry {
  key: string;
  value: Widget | undefined;
}

export interface NodeData {
  name: string;
  inputs: Input[];
  outputs: Output[];
  widget: Widgets | undefined;
}

export interface ComfyNode {
  id: string;
  type: string;
  position: Position | undefined;
  position_absolute: Position | undefined;
  width: number;
  height: number;
}

export interface ComfyEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type: string;
}

export interface SerializedGraph {
  graph_id?: string | undefined;
  author_id?: string | undefined;
  ancestor_graph_id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  nodes: ComfyNode[];
  edges: ComfyEdge[];
}

function createBasePosition(): Position {
  return { x: 0, y: 0 };
}

export const Position = {
  encode(message: Position, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(13).float(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(21).float(message.y);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Position {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePosition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 13) {
            break;
          }

          message.x = reader.float();
          continue;
        case 2:
          if (tag !== 21) {
            break;
          }

          message.y = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Position>): Position {
    return Position.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Position>): Position {
    const message = createBasePosition();
    message.x = object.x ?? 0;
    message.y = object.y ?? 0;
    return message;
  },
};

function createBaseInput(): Input {
  return { name: "", type: "", optional: false };
}

export const Input = {
  encode(message: Input, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.optional === true) {
      writer.uint32(24).bool(message.optional);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Input {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.optional = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Input>): Input {
    return Input.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Input>): Input {
    const message = createBaseInput();
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    message.optional = object.optional ?? false;
    return message;
  },
};

function createBaseOutput(): Output {
  return { name: "", type: "" };
}

export const Output = {
  encode(message: Output, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Output {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Output>): Output {
    return Output.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Output>): Output {
    const message = createBaseOutput();
    message.name = object.name ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseWidget(): Widget {
  return { name: "", optional: false, type: "", value: undefined };
}

export const Widget = {
  encode(message: Widget, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.optional === true) {
      writer.uint32(16).bool(message.optional);
    }
    if (message.type !== "") {
      writer.uint32(26).string(message.type);
    }
    if (message.value !== undefined) {
      Struct.encode(Struct.wrap(message.value), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Widget {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWidget();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.optional = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.type = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.value = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Widget>): Widget {
    return Widget.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Widget>): Widget {
    const message = createBaseWidget();
    message.name = object.name ?? "";
    message.optional = object.optional ?? false;
    message.type = object.type ?? "";
    message.value = object.value ?? undefined;
    return message;
  },
};

function createBaseWidgets(): Widgets {
  return { items: {} };
}

export const Widgets = {
  encode(message: Widgets, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.items).forEach(([key, value]) => {
      Widgets_ItemsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Widgets {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWidgets();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = Widgets_ItemsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.items[entry1.key] = entry1.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Widgets>): Widgets {
    return Widgets.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Widgets>): Widgets {
    const message = createBaseWidgets();
    message.items = Object.entries(object.items ?? {}).reduce<{ [key: string]: Widget }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Widget.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseWidgets_ItemsEntry(): Widgets_ItemsEntry {
  return { key: "", value: undefined };
}

export const Widgets_ItemsEntry = {
  encode(message: Widgets_ItemsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Widget.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Widgets_ItemsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWidgets_ItemsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = Widget.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Widgets_ItemsEntry>): Widgets_ItemsEntry {
    return Widgets_ItemsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Widgets_ItemsEntry>): Widgets_ItemsEntry {
    const message = createBaseWidgets_ItemsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? Widget.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseNodeData(): NodeData {
  return { name: "", inputs: [], outputs: [], widget: undefined };
}

export const NodeData = {
  encode(message: NodeData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.inputs) {
      Input.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.outputs) {
      Output.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.widget !== undefined) {
      Widgets.encode(message.widget, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.inputs.push(Input.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.outputs.push(Output.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.widget = Widgets.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeData>): NodeData {
    return NodeData.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeData>): NodeData {
    const message = createBaseNodeData();
    message.name = object.name ?? "";
    message.inputs = object.inputs?.map((e) => Input.fromPartial(e)) || [];
    message.outputs = object.outputs?.map((e) => Output.fromPartial(e)) || [];
    message.widget = (object.widget !== undefined && object.widget !== null)
      ? Widgets.fromPartial(object.widget)
      : undefined;
    return message;
  },
};

function createBaseComfyNode(): ComfyNode {
  return { id: "", type: "", position: undefined, position_absolute: undefined, width: 0, height: 0 };
}

export const ComfyNode = {
  encode(message: ComfyNode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.position !== undefined) {
      Position.encode(message.position, writer.uint32(26).fork()).ldelim();
    }
    if (message.position_absolute !== undefined) {
      Position.encode(message.position_absolute, writer.uint32(34).fork()).ldelim();
    }
    if (message.width !== 0) {
      writer.uint32(40).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(48).uint32(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComfyNode {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComfyNode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.position = Position.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.position_absolute = Position.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.width = reader.uint32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.height = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ComfyNode>): ComfyNode {
    return ComfyNode.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ComfyNode>): ComfyNode {
    const message = createBaseComfyNode();
    message.id = object.id ?? "";
    message.type = object.type ?? "";
    message.position = (object.position !== undefined && object.position !== null)
      ? Position.fromPartial(object.position)
      : undefined;
    message.position_absolute = (object.position_absolute !== undefined && object.position_absolute !== null)
      ? Position.fromPartial(object.position_absolute)
      : undefined;
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseComfyEdge(): ComfyEdge {
  return { id: "", source: "", sourceHandle: "", target: "", targetHandle: "", type: "" };
}

export const ComfyEdge = {
  encode(message: ComfyEdge, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.source !== "") {
      writer.uint32(18).string(message.source);
    }
    if (message.sourceHandle !== "") {
      writer.uint32(26).string(message.sourceHandle);
    }
    if (message.target !== "") {
      writer.uint32(34).string(message.target);
    }
    if (message.targetHandle !== "") {
      writer.uint32(42).string(message.targetHandle);
    }
    if (message.type !== "") {
      writer.uint32(50).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComfyEdge {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComfyEdge();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.source = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.sourceHandle = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.target = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.targetHandle = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.type = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ComfyEdge>): ComfyEdge {
    return ComfyEdge.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ComfyEdge>): ComfyEdge {
    const message = createBaseComfyEdge();
    message.id = object.id ?? "";
    message.source = object.source ?? "";
    message.sourceHandle = object.sourceHandle ?? "";
    message.target = object.target ?? "";
    message.targetHandle = object.targetHandle ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseSerializedGraph(): SerializedGraph {
  return {
    graph_id: undefined,
    author_id: undefined,
    ancestor_graph_id: undefined,
    title: undefined,
    description: undefined,
    nodes: [],
    edges: [],
  };
}

export const SerializedGraph = {
  encode(message: SerializedGraph, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.graph_id !== undefined) {
      writer.uint32(10).string(message.graph_id);
    }
    if (message.author_id !== undefined) {
      writer.uint32(18).string(message.author_id);
    }
    if (message.ancestor_graph_id !== undefined) {
      writer.uint32(26).string(message.ancestor_graph_id);
    }
    if (message.title !== undefined) {
      writer.uint32(34).string(message.title);
    }
    if (message.description !== undefined) {
      writer.uint32(42).string(message.description);
    }
    for (const v of message.nodes) {
      ComfyNode.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.edges) {
      ComfyEdge.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SerializedGraph {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSerializedGraph();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.graph_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.author_id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.ancestor_graph_id = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.title = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.description = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.nodes.push(ComfyNode.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.edges.push(ComfyEdge.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<SerializedGraph>): SerializedGraph {
    return SerializedGraph.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SerializedGraph>): SerializedGraph {
    const message = createBaseSerializedGraph();
    message.graph_id = object.graph_id ?? undefined;
    message.author_id = object.author_id ?? undefined;
    message.ancestor_graph_id = object.ancestor_graph_id ?? undefined;
    message.title = object.title ?? undefined;
    message.description = object.description ?? undefined;
    message.nodes = object.nodes?.map((e) => ComfyNode.fromPartial(e)) || [];
    message.edges = object.edges?.map((e) => ComfyEdge.fromPartial(e)) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
