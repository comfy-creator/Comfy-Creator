/* eslint-disable */
import Long from "long";
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";
import { Any } from "./google/protobuf/any";
import { Empty } from "./google/protobuf/empty";
import { Struct } from "./google/protobuf/struct";
import { SerializedGraph } from "./serialized_graph.v1";

export const protobufPackage = "comfy_request.v1";

/** These are more direct client-created workflows for client -> server -> worker */

export enum JobStatus {
  QUEUED = "QUEUED",
  EXECUTING = "EXECUTING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
  ABORTED = "ABORTED",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function jobStatusFromJSON(object: any): JobStatus {
  switch (object) {
    case 0:
    case "QUEUED":
      return JobStatus.QUEUED;
    case 1:
    case "EXECUTING":
      return JobStatus.EXECUTING;
    case 2:
    case "COMPLETED":
      return JobStatus.COMPLETED;
    case 3:
    case "ERROR":
      return JobStatus.ERROR;
    case 4:
    case "ABORTED":
      return JobStatus.ABORTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return JobStatus.UNRECOGNIZED;
  }
}

export function jobStatusToNumber(object: JobStatus): number {
  switch (object) {
    case JobStatus.QUEUED:
      return 0;
    case JobStatus.EXECUTING:
      return 1;
    case JobStatus.COMPLETED:
      return 2;
    case JobStatus.ERROR:
      return 3;
    case JobStatus.ABORTED:
      return 4;
    case JobStatus.UNRECOGNIZED:
    default:
      return -1;
  }
}

/** Message definition for WorkflowStep */
export interface WorkflowStep {
  class_type: string;
  /** Inputs are too idiosyncratic to be typed specifically */
  inputs: { [key: string]: any } | undefined;
}

export interface FileReference {
  /** string must be a valid url */
  url: string;
  /** Comfy UI terminology: key 'type', values 'temp' | 'output' */
  is_temp: boolean;
}

/**
 * TO DO: add conditional check for url conformity
 * Two files with the same hash are treated as equivalent; we use file-hashes as filenames.
 * File types returned:
 * image: png, jpg, svg, webp, gif
 * video: mp4
 * data: json (icluding RLE-encoded masks), npy (numpy array for embeddings)
 * TO DO: in the future, we may want more metadata, such as mask VS image VS latent preview
 */
export interface WorkflowFile {
  /** unique identifier for the file; use this instead of a filename */
  blake3_hash: string;
  /** ComfyUI terminology: key 'format' */
  mime_type: string;
  reference?: FileReference | undefined;
  bytes?: Uint8Array | undefined;
}

/** It would be helpful to have blake3 hashes rather than filenames */
export interface LocalFile {
  name: string;
  path: string;
  /** in bytes */
  size: number;
  mime_type: string;
}

export interface LocalFiles {
  added: LocalFile[];
  updated: LocalFile[];
  removed: LocalFile[];
}

export interface JobId {
  job_id: string;
}

/**
 * TO DO: consider implementing this
 * enum ResponseFormat {
 *   URL = 0;
 *   BINARY = 1;
 * }
 */
export interface OutputConfig {
  /** writes outputs to the specified collaborative graph */
  write_to_graph_id?:
    | string
    | undefined;
  /** Performs a callback to the webhook url with the outputs */
  webhook_url?: string | undefined;
}

export interface ComfyRequest {
  /**
   * This is a client-supplied identifier; it allows the client to associate responses
   * or multiple requests with the same identifier. Useful for webhook callbacks.
   */
  request_id?:
    | string
    | undefined;
  /** keys are node_ids */
  workflow: { [key: string]: WorkflowStep };
  serialized_graph?: SerializedGraph | undefined;
  output_config?: OutputConfig | undefined;
}

export interface ComfyRequest_WorkflowEntry {
  key: string;
  value: WorkflowStep | undefined;
}

/** This is published to pulsar as a cumulative message; it contains all prior msg info */
export interface JobSnapshot {
  job_id: string;
  request_id?: string | undefined;
  status: JobStatus;
  outputs: JobOutput[];
  metrics?: JobSnapshot_Metrics | undefined;
}

/** Metrics are cumulative for the entire job */
export interface JobSnapshot_Metrics {
  queue_seconds: number;
  execution_seconds: number;
}

export interface JobOutput {
  /** id of the node in the original workflow that produced this output */
  node_id: string;
  /** output node's class type */
  class_type: string;
  file: WorkflowFile | undefined;
}

/**
 * Specify subset of fully qualified extension names, to load their node defs
 * Leave empty to retrieve all node definitions
 */
export interface NodeDefRequest {
  extension_ids: string[];
}

/**
 * Input specs are used for to populate input-widgets. Example:
 * number: min / max / step values for a number
 * string: multiline: true / false
 * or 'default' for any value really
 */
export interface NodeDefinition {
  display_name: string;
  description: string;
  category: string;
  inputs: NodeDefinition_InputDef[];
  outputs: NodeDefinition_OutputDef[];
  output_node: boolean;
}

export interface NodeDefinition_InputDef {
  label: string;
  edge_type: string;
  spec: { [key: string]: any } | undefined;
}

export interface NodeDefinition_OutputDef {
  label: string;
  edge_type: string;
}

export interface NodeDefs {
  defs: { [key: string]: NodeDefinition };
}

export interface NodeDefs_DefsEntry {
  key: string;
  value: NodeDefinition | undefined;
}

export interface Models {
  info: Models_Info[];
}

export interface Models_Info {
  blake3_hash: string;
  display_name: string;
}

/** Maps base-family to model */
export interface ModelCatalog {
  models: { [key: string]: Models };
}

export interface ModelCatalog_ModelsEntry {
  key: string;
  value: Models | undefined;
}

/** Leave blank to retrieve all models */
export interface ModelCatalogRequest {
  base_family: string[];
}

export interface StatusMessage {
  sid: string;
  status: { [key: string]: Any };
}

export interface StatusMessage_StatusEntry {
  key: string;
  value: Any | undefined;
}

export interface ProgressMessage {
  max: number;
  node: string;
  value: number;
  prompt_id: string;
}

export interface ExecutingMessage {
  prompt_id: string;
  node: string;
}

export interface ExecutedMessage {
  node: string;
  prompt_id: string;
  output: { [key: string]: Any };
}

export interface ExecutedMessage_OutputEntry {
  key: string;
  value: Any | undefined;
}

export interface ComfyMessage {
  status?: StatusMessage | undefined;
  progress?: ProgressMessage | undefined;
  executing?: ExecutingMessage | undefined;
  executed?: ExecutedMessage | undefined;
  data?: Uint8Array | undefined;
}

function createBaseWorkflowStep(): WorkflowStep {
  return { class_type: "", inputs: undefined };
}

export const WorkflowStep = {
  encode(message: WorkflowStep, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.class_type !== "") {
      writer.uint32(10).string(message.class_type);
    }
    if (message.inputs !== undefined) {
      Struct.encode(Struct.wrap(message.inputs), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowStep {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowStep();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.class_type = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.inputs = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<WorkflowStep>): WorkflowStep {
    return WorkflowStep.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowStep>): WorkflowStep {
    const message = createBaseWorkflowStep();
    message.class_type = object.class_type ?? "";
    message.inputs = object.inputs ?? undefined;
    return message;
  },
};

function createBaseFileReference(): FileReference {
  return { url: "", is_temp: false };
}

export const FileReference = {
  encode(message: FileReference, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    if (message.is_temp === true) {
      writer.uint32(16).bool(message.is_temp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileReference {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileReference();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.is_temp = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<FileReference>): FileReference {
    return FileReference.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<FileReference>): FileReference {
    const message = createBaseFileReference();
    message.url = object.url ?? "";
    message.is_temp = object.is_temp ?? false;
    return message;
  },
};

function createBaseWorkflowFile(): WorkflowFile {
  return { blake3_hash: "", mime_type: "", reference: undefined, bytes: undefined };
}

export const WorkflowFile = {
  encode(message: WorkflowFile, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.blake3_hash !== "") {
      writer.uint32(10).string(message.blake3_hash);
    }
    if (message.mime_type !== "") {
      writer.uint32(18).string(message.mime_type);
    }
    if (message.reference !== undefined) {
      FileReference.encode(message.reference, writer.uint32(26).fork()).ldelim();
    }
    if (message.bytes !== undefined) {
      writer.uint32(34).bytes(message.bytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowFile {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowFile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.blake3_hash = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mime_type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.reference = FileReference.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.bytes = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<WorkflowFile>): WorkflowFile {
    return WorkflowFile.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowFile>): WorkflowFile {
    const message = createBaseWorkflowFile();
    message.blake3_hash = object.blake3_hash ?? "";
    message.mime_type = object.mime_type ?? "";
    message.reference = (object.reference !== undefined && object.reference !== null)
      ? FileReference.fromPartial(object.reference)
      : undefined;
    message.bytes = object.bytes ?? undefined;
    return message;
  },
};

function createBaseLocalFile(): LocalFile {
  return { name: "", path: "", size: 0, mime_type: "" };
}

export const LocalFile = {
  encode(message: LocalFile, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.path !== "") {
      writer.uint32(18).string(message.path);
    }
    if (message.size !== 0) {
      writer.uint32(24).int64(message.size);
    }
    if (message.mime_type !== "") {
      writer.uint32(34).string(message.mime_type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LocalFile {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocalFile();
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

          message.path = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.size = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.mime_type = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<LocalFile>): LocalFile {
    return LocalFile.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<LocalFile>): LocalFile {
    const message = createBaseLocalFile();
    message.name = object.name ?? "";
    message.path = object.path ?? "";
    message.size = object.size ?? 0;
    message.mime_type = object.mime_type ?? "";
    return message;
  },
};

function createBaseLocalFiles(): LocalFiles {
  return { added: [], updated: [], removed: [] };
}

export const LocalFiles = {
  encode(message: LocalFiles, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.added) {
      LocalFile.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.updated) {
      LocalFile.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.removed) {
      LocalFile.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LocalFiles {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocalFiles();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.added.push(LocalFile.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.updated.push(LocalFile.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.removed.push(LocalFile.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<LocalFiles>): LocalFiles {
    return LocalFiles.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<LocalFiles>): LocalFiles {
    const message = createBaseLocalFiles();
    message.added = object.added?.map((e) => LocalFile.fromPartial(e)) || [];
    message.updated = object.updated?.map((e) => LocalFile.fromPartial(e)) || [];
    message.removed = object.removed?.map((e) => LocalFile.fromPartial(e)) || [];
    return message;
  },
};

function createBaseJobId(): JobId {
  return { job_id: "" };
}

export const JobId = {
  encode(message: JobId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.job_id !== "") {
      writer.uint32(10).string(message.job_id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobId {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.job_id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<JobId>): JobId {
    return JobId.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<JobId>): JobId {
    const message = createBaseJobId();
    message.job_id = object.job_id ?? "";
    return message;
  },
};

function createBaseOutputConfig(): OutputConfig {
  return { write_to_graph_id: undefined, webhook_url: undefined };
}

export const OutputConfig = {
  encode(message: OutputConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.write_to_graph_id !== undefined) {
      writer.uint32(10).string(message.write_to_graph_id);
    }
    if (message.webhook_url !== undefined) {
      writer.uint32(18).string(message.webhook_url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OutputConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOutputConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.write_to_graph_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.webhook_url = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<OutputConfig>): OutputConfig {
    return OutputConfig.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OutputConfig>): OutputConfig {
    const message = createBaseOutputConfig();
    message.write_to_graph_id = object.write_to_graph_id ?? undefined;
    message.webhook_url = object.webhook_url ?? undefined;
    return message;
  },
};

function createBaseComfyRequest(): ComfyRequest {
  return { request_id: undefined, workflow: {}, serialized_graph: undefined, output_config: undefined };
}

export const ComfyRequest = {
  encode(message: ComfyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request_id !== undefined) {
      writer.uint32(10).string(message.request_id);
    }
    Object.entries(message.workflow).forEach(([key, value]) => {
      ComfyRequest_WorkflowEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    if (message.serialized_graph !== undefined) {
      SerializedGraph.encode(message.serialized_graph, writer.uint32(26).fork()).ldelim();
    }
    if (message.output_config !== undefined) {
      OutputConfig.encode(message.output_config, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComfyRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComfyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.request_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          const entry2 = ComfyRequest_WorkflowEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.workflow[entry2.key] = entry2.value;
          }
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.serialized_graph = SerializedGraph.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.output_config = OutputConfig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ComfyRequest>): ComfyRequest {
    return ComfyRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ComfyRequest>): ComfyRequest {
    const message = createBaseComfyRequest();
    message.request_id = object.request_id ?? undefined;
    message.workflow = Object.entries(object.workflow ?? {}).reduce<{ [key: string]: WorkflowStep }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = WorkflowStep.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    message.serialized_graph = (object.serialized_graph !== undefined && object.serialized_graph !== null)
      ? SerializedGraph.fromPartial(object.serialized_graph)
      : undefined;
    message.output_config = (object.output_config !== undefined && object.output_config !== null)
      ? OutputConfig.fromPartial(object.output_config)
      : undefined;
    return message;
  },
};

function createBaseComfyRequest_WorkflowEntry(): ComfyRequest_WorkflowEntry {
  return { key: "", value: undefined };
}

export const ComfyRequest_WorkflowEntry = {
  encode(message: ComfyRequest_WorkflowEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      WorkflowStep.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComfyRequest_WorkflowEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComfyRequest_WorkflowEntry();
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

          message.value = WorkflowStep.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ComfyRequest_WorkflowEntry>): ComfyRequest_WorkflowEntry {
    return ComfyRequest_WorkflowEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ComfyRequest_WorkflowEntry>): ComfyRequest_WorkflowEntry {
    const message = createBaseComfyRequest_WorkflowEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? WorkflowStep.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseJobSnapshot(): JobSnapshot {
  return { job_id: "", request_id: undefined, status: JobStatus.QUEUED, outputs: [], metrics: undefined };
}

export const JobSnapshot = {
  encode(message: JobSnapshot, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.job_id !== "") {
      writer.uint32(10).string(message.job_id);
    }
    if (message.request_id !== undefined) {
      writer.uint32(18).string(message.request_id);
    }
    if (message.status !== JobStatus.QUEUED) {
      writer.uint32(24).int32(jobStatusToNumber(message.status));
    }
    for (const v of message.outputs) {
      JobOutput.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.metrics !== undefined) {
      JobSnapshot_Metrics.encode(message.metrics, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobSnapshot {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobSnapshot();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.job_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.request_id = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.status = jobStatusFromJSON(reader.int32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.outputs.push(JobOutput.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.metrics = JobSnapshot_Metrics.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<JobSnapshot>): JobSnapshot {
    return JobSnapshot.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<JobSnapshot>): JobSnapshot {
    const message = createBaseJobSnapshot();
    message.job_id = object.job_id ?? "";
    message.request_id = object.request_id ?? undefined;
    message.status = object.status ?? JobStatus.QUEUED;
    message.outputs = object.outputs?.map((e) => JobOutput.fromPartial(e)) || [];
    message.metrics = (object.metrics !== undefined && object.metrics !== null)
      ? JobSnapshot_Metrics.fromPartial(object.metrics)
      : undefined;
    return message;
  },
};

function createBaseJobSnapshot_Metrics(): JobSnapshot_Metrics {
  return { queue_seconds: 0, execution_seconds: 0 };
}

export const JobSnapshot_Metrics = {
  encode(message: JobSnapshot_Metrics, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.queue_seconds !== 0) {
      writer.uint32(8).uint32(message.queue_seconds);
    }
    if (message.execution_seconds !== 0) {
      writer.uint32(16).uint32(message.execution_seconds);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobSnapshot_Metrics {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobSnapshot_Metrics();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.queue_seconds = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.execution_seconds = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<JobSnapshot_Metrics>): JobSnapshot_Metrics {
    return JobSnapshot_Metrics.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<JobSnapshot_Metrics>): JobSnapshot_Metrics {
    const message = createBaseJobSnapshot_Metrics();
    message.queue_seconds = object.queue_seconds ?? 0;
    message.execution_seconds = object.execution_seconds ?? 0;
    return message;
  },
};

function createBaseJobOutput(): JobOutput {
  return { node_id: "", class_type: "", file: undefined };
}

export const JobOutput = {
  encode(message: JobOutput, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.node_id !== "") {
      writer.uint32(10).string(message.node_id);
    }
    if (message.class_type !== "") {
      writer.uint32(18).string(message.class_type);
    }
    if (message.file !== undefined) {
      WorkflowFile.encode(message.file, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JobOutput {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJobOutput();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.node_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.class_type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.file = WorkflowFile.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<JobOutput>): JobOutput {
    return JobOutput.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<JobOutput>): JobOutput {
    const message = createBaseJobOutput();
    message.node_id = object.node_id ?? "";
    message.class_type = object.class_type ?? "";
    message.file = (object.file !== undefined && object.file !== null)
      ? WorkflowFile.fromPartial(object.file)
      : undefined;
    return message;
  },
};

function createBaseNodeDefRequest(): NodeDefRequest {
  return { extension_ids: [] };
}

export const NodeDefRequest = {
  encode(message: NodeDefRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.extension_ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.extension_ids.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeDefRequest>): NodeDefRequest {
    return NodeDefRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefRequest>): NodeDefRequest {
    const message = createBaseNodeDefRequest();
    message.extension_ids = object.extension_ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseNodeDefinition(): NodeDefinition {
  return { display_name: "", description: "", category: "", inputs: [], outputs: [], output_node: false };
}

export const NodeDefinition = {
  encode(message: NodeDefinition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.display_name !== "") {
      writer.uint32(10).string(message.display_name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.category !== "") {
      writer.uint32(26).string(message.category);
    }
    for (const v of message.inputs) {
      NodeDefinition_InputDef.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.outputs) {
      NodeDefinition_OutputDef.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.output_node === true) {
      writer.uint32(48).bool(message.output_node);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefinition {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefinition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.display_name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.category = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.inputs.push(NodeDefinition_InputDef.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.outputs.push(NodeDefinition_OutputDef.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.output_node = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeDefinition>): NodeDefinition {
    return NodeDefinition.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefinition>): NodeDefinition {
    const message = createBaseNodeDefinition();
    message.display_name = object.display_name ?? "";
    message.description = object.description ?? "";
    message.category = object.category ?? "";
    message.inputs = object.inputs?.map((e) => NodeDefinition_InputDef.fromPartial(e)) || [];
    message.outputs = object.outputs?.map((e) => NodeDefinition_OutputDef.fromPartial(e)) || [];
    message.output_node = object.output_node ?? false;
    return message;
  },
};

function createBaseNodeDefinition_InputDef(): NodeDefinition_InputDef {
  return { label: "", edge_type: "", spec: undefined };
}

export const NodeDefinition_InputDef = {
  encode(message: NodeDefinition_InputDef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.label !== "") {
      writer.uint32(10).string(message.label);
    }
    if (message.edge_type !== "") {
      writer.uint32(18).string(message.edge_type);
    }
    if (message.spec !== undefined) {
      Struct.encode(Struct.wrap(message.spec), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefinition_InputDef {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefinition_InputDef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.label = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.edge_type = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.spec = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeDefinition_InputDef>): NodeDefinition_InputDef {
    return NodeDefinition_InputDef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefinition_InputDef>): NodeDefinition_InputDef {
    const message = createBaseNodeDefinition_InputDef();
    message.label = object.label ?? "";
    message.edge_type = object.edge_type ?? "";
    message.spec = object.spec ?? undefined;
    return message;
  },
};

function createBaseNodeDefinition_OutputDef(): NodeDefinition_OutputDef {
  return { label: "", edge_type: "" };
}

export const NodeDefinition_OutputDef = {
  encode(message: NodeDefinition_OutputDef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.label !== "") {
      writer.uint32(10).string(message.label);
    }
    if (message.edge_type !== "") {
      writer.uint32(18).string(message.edge_type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefinition_OutputDef {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefinition_OutputDef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.label = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.edge_type = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeDefinition_OutputDef>): NodeDefinition_OutputDef {
    return NodeDefinition_OutputDef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefinition_OutputDef>): NodeDefinition_OutputDef {
    const message = createBaseNodeDefinition_OutputDef();
    message.label = object.label ?? "";
    message.edge_type = object.edge_type ?? "";
    return message;
  },
};

function createBaseNodeDefs(): NodeDefs {
  return { defs: {} };
}

export const NodeDefs = {
  encode(message: NodeDefs, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.defs).forEach(([key, value]) => {
      NodeDefs_DefsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefs {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = NodeDefs_DefsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.defs[entry1.key] = entry1.value;
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

  create(base?: DeepPartial<NodeDefs>): NodeDefs {
    return NodeDefs.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefs>): NodeDefs {
    const message = createBaseNodeDefs();
    message.defs = Object.entries(object.defs ?? {}).reduce<{ [key: string]: NodeDefinition }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = NodeDefinition.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseNodeDefs_DefsEntry(): NodeDefs_DefsEntry {
  return { key: "", value: undefined };
}

export const NodeDefs_DefsEntry = {
  encode(message: NodeDefs_DefsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      NodeDefinition.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDefs_DefsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNodeDefs_DefsEntry();
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

          message.value = NodeDefinition.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<NodeDefs_DefsEntry>): NodeDefs_DefsEntry {
    return NodeDefs_DefsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<NodeDefs_DefsEntry>): NodeDefs_DefsEntry {
    const message = createBaseNodeDefs_DefsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? NodeDefinition.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseModels(): Models {
  return { info: [] };
}

export const Models = {
  encode(message: Models, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.info) {
      Models_Info.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Models {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModels();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.info.push(Models_Info.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Models>): Models {
    return Models.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Models>): Models {
    const message = createBaseModels();
    message.info = object.info?.map((e) => Models_Info.fromPartial(e)) || [];
    return message;
  },
};

function createBaseModels_Info(): Models_Info {
  return { blake3_hash: "", display_name: "" };
}

export const Models_Info = {
  encode(message: Models_Info, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.blake3_hash !== "") {
      writer.uint32(10).string(message.blake3_hash);
    }
    if (message.display_name !== "") {
      writer.uint32(18).string(message.display_name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Models_Info {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModels_Info();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.blake3_hash = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.display_name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<Models_Info>): Models_Info {
    return Models_Info.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Models_Info>): Models_Info {
    const message = createBaseModels_Info();
    message.blake3_hash = object.blake3_hash ?? "";
    message.display_name = object.display_name ?? "";
    return message;
  },
};

function createBaseModelCatalog(): ModelCatalog {
  return { models: {} };
}

export const ModelCatalog = {
  encode(message: ModelCatalog, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.models).forEach(([key, value]) => {
      ModelCatalog_ModelsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModelCatalog {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModelCatalog();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = ModelCatalog_ModelsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.models[entry1.key] = entry1.value;
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

  create(base?: DeepPartial<ModelCatalog>): ModelCatalog {
    return ModelCatalog.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ModelCatalog>): ModelCatalog {
    const message = createBaseModelCatalog();
    message.models = Object.entries(object.models ?? {}).reduce<{ [key: string]: Models }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Models.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseModelCatalog_ModelsEntry(): ModelCatalog_ModelsEntry {
  return { key: "", value: undefined };
}

export const ModelCatalog_ModelsEntry = {
  encode(message: ModelCatalog_ModelsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Models.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModelCatalog_ModelsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModelCatalog_ModelsEntry();
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

          message.value = Models.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ModelCatalog_ModelsEntry>): ModelCatalog_ModelsEntry {
    return ModelCatalog_ModelsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ModelCatalog_ModelsEntry>): ModelCatalog_ModelsEntry {
    const message = createBaseModelCatalog_ModelsEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? Models.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseModelCatalogRequest(): ModelCatalogRequest {
  return { base_family: [] };
}

export const ModelCatalogRequest = {
  encode(message: ModelCatalogRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.base_family) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ModelCatalogRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModelCatalogRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.base_family.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ModelCatalogRequest>): ModelCatalogRequest {
    return ModelCatalogRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ModelCatalogRequest>): ModelCatalogRequest {
    const message = createBaseModelCatalogRequest();
    message.base_family = object.base_family?.map((e) => e) || [];
    return message;
  },
};

function createBaseStatusMessage(): StatusMessage {
  return { sid: "", status: {} };
}

export const StatusMessage = {
  encode(message: StatusMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sid !== "") {
      writer.uint32(10).string(message.sid);
    }
    Object.entries(message.status).forEach(([key, value]) => {
      StatusMessage_StatusEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sid = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          const entry2 = StatusMessage_StatusEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.status[entry2.key] = entry2.value;
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

  create(base?: DeepPartial<StatusMessage>): StatusMessage {
    return StatusMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<StatusMessage>): StatusMessage {
    const message = createBaseStatusMessage();
    message.sid = object.sid ?? "";
    message.status = Object.entries(object.status ?? {}).reduce<{ [key: string]: Any }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Any.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseStatusMessage_StatusEntry(): StatusMessage_StatusEntry {
  return { key: "", value: undefined };
}

export const StatusMessage_StatusEntry = {
  encode(message: StatusMessage_StatusEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Any.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusMessage_StatusEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusMessage_StatusEntry();
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

          message.value = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<StatusMessage_StatusEntry>): StatusMessage_StatusEntry {
    return StatusMessage_StatusEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<StatusMessage_StatusEntry>): StatusMessage_StatusEntry {
    const message = createBaseStatusMessage_StatusEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null) ? Any.fromPartial(object.value) : undefined;
    return message;
  },
};

function createBaseProgressMessage(): ProgressMessage {
  return { max: 0, node: "", value: 0, prompt_id: "" };
}

export const ProgressMessage = {
  encode(message: ProgressMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.max !== 0) {
      writer.uint32(8).int32(message.max);
    }
    if (message.node !== "") {
      writer.uint32(18).string(message.node);
    }
    if (message.value !== 0) {
      writer.uint32(24).int32(message.value);
    }
    if (message.prompt_id !== "") {
      writer.uint32(34).string(message.prompt_id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProgressMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProgressMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.max = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.node = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.value = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.prompt_id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ProgressMessage>): ProgressMessage {
    return ProgressMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ProgressMessage>): ProgressMessage {
    const message = createBaseProgressMessage();
    message.max = object.max ?? 0;
    message.node = object.node ?? "";
    message.value = object.value ?? 0;
    message.prompt_id = object.prompt_id ?? "";
    return message;
  },
};

function createBaseExecutingMessage(): ExecutingMessage {
  return { prompt_id: "", node: "" };
}

export const ExecutingMessage = {
  encode(message: ExecutingMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.prompt_id !== "") {
      writer.uint32(10).string(message.prompt_id);
    }
    if (message.node !== "") {
      writer.uint32(18).string(message.node);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecutingMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecutingMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.prompt_id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.node = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ExecutingMessage>): ExecutingMessage {
    return ExecutingMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExecutingMessage>): ExecutingMessage {
    const message = createBaseExecutingMessage();
    message.prompt_id = object.prompt_id ?? "";
    message.node = object.node ?? "";
    return message;
  },
};

function createBaseExecutedMessage(): ExecutedMessage {
  return { node: "", prompt_id: "", output: {} };
}

export const ExecutedMessage = {
  encode(message: ExecutedMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.node !== "") {
      writer.uint32(10).string(message.node);
    }
    if (message.prompt_id !== "") {
      writer.uint32(18).string(message.prompt_id);
    }
    Object.entries(message.output).forEach(([key, value]) => {
      ExecutedMessage_OutputEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecutedMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecutedMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.node = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.prompt_id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = ExecutedMessage_OutputEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.output[entry3.key] = entry3.value;
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

  create(base?: DeepPartial<ExecutedMessage>): ExecutedMessage {
    return ExecutedMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExecutedMessage>): ExecutedMessage {
    const message = createBaseExecutedMessage();
    message.node = object.node ?? "";
    message.prompt_id = object.prompt_id ?? "";
    message.output = Object.entries(object.output ?? {}).reduce<{ [key: string]: Any }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Any.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseExecutedMessage_OutputEntry(): ExecutedMessage_OutputEntry {
  return { key: "", value: undefined };
}

export const ExecutedMessage_OutputEntry = {
  encode(message: ExecutedMessage_OutputEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Any.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecutedMessage_OutputEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecutedMessage_OutputEntry();
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

          message.value = Any.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ExecutedMessage_OutputEntry>): ExecutedMessage_OutputEntry {
    return ExecutedMessage_OutputEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ExecutedMessage_OutputEntry>): ExecutedMessage_OutputEntry {
    const message = createBaseExecutedMessage_OutputEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null) ? Any.fromPartial(object.value) : undefined;
    return message;
  },
};

function createBaseComfyMessage(): ComfyMessage {
  return { status: undefined, progress: undefined, executing: undefined, executed: undefined, data: undefined };
}

export const ComfyMessage = {
  encode(message: ComfyMessage, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== undefined) {
      StatusMessage.encode(message.status, writer.uint32(10).fork()).ldelim();
    }
    if (message.progress !== undefined) {
      ProgressMessage.encode(message.progress, writer.uint32(18).fork()).ldelim();
    }
    if (message.executing !== undefined) {
      ExecutingMessage.encode(message.executing, writer.uint32(26).fork()).ldelim();
    }
    if (message.executed !== undefined) {
      ExecutedMessage.encode(message.executed, writer.uint32(34).fork()).ldelim();
    }
    if (message.data !== undefined) {
      writer.uint32(42).bytes(message.data);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ComfyMessage {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseComfyMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.status = StatusMessage.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.progress = ProgressMessage.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.executing = ExecutingMessage.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.executed = ExecutedMessage.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.data = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<ComfyMessage>): ComfyMessage {
    return ComfyMessage.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ComfyMessage>): ComfyMessage {
    const message = createBaseComfyMessage();
    message.status = (object.status !== undefined && object.status !== null)
      ? StatusMessage.fromPartial(object.status)
      : undefined;
    message.progress = (object.progress !== undefined && object.progress !== null)
      ? ProgressMessage.fromPartial(object.progress)
      : undefined;
    message.executing = (object.executing !== undefined && object.executing !== null)
      ? ExecutingMessage.fromPartial(object.executing)
      : undefined;
    message.executed = (object.executed !== undefined && object.executed !== null)
      ? ExecutedMessage.fromPartial(object.executed)
      : undefined;
    message.data = object.data ?? undefined;
    return message;
  },
};

export type ComfyDefinition = typeof ComfyDefinition;
export const ComfyDefinition = {
  name: "Comfy",
  fullName: "comfy_request.v1.Comfy",
  methods: {
    /**
     * Queue a workflow and receive the job id.
     * Results can be retrieved from the graph-id or via a webhook callback.
     */
    run: {
      name: "Run",
      requestType: ComfyRequest,
      requestStream: false,
      responseType: JobSnapshot,
      responseStream: false,
      options: {},
    },
    /** Queue a workflow and await its outputs (synchronous) */
    runSync: {
      name: "RunSync",
      requestType: ComfyRequest,
      requestStream: false,
      responseType: JobOutput,
      responseStream: true,
      options: {},
    },
    /** Looks up the most current job state */
    getJob: {
      name: "GetJob",
      requestType: JobId,
      requestStream: false,
      responseType: JobSnapshot,
      responseStream: false,
      options: {},
    },
    /** Looks up the most current job state */
    streamJob: {
      name: "StreamJob",
      requestType: JobId,
      requestStream: false,
      responseType: ComfyMessage,
      responseStream: true,
      options: {},
    },
    /** Gets the definitions of all nodes supported by this server */
    getNodeDefinitions: {
      name: "GetNodeDefinitions",
      requestType: NodeDefRequest,
      requestStream: false,
      responseType: NodeDefs,
      responseStream: false,
      options: {},
    },
    /** Get models, grouped by architecture */
    getModelCatalog: {
      name: "GetModelCatalog",
      requestType: ModelCatalogRequest,
      requestStream: false,
      responseType: ModelCatalog,
      responseStream: false,
      options: {},
    },
    /**
     * Streams updates to local-files in realtime.
     * This is only used when running Comfy Creator with local files.
     */
    syncLocalFiles: {
      name: "SyncLocalFiles",
      requestType: Empty,
      requestStream: false,
      responseType: LocalFiles,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface ComfyServiceImplementation<CallContextExt = {}> {
  /**
   * Queue a workflow and receive the job id.
   * Results can be retrieved from the graph-id or via a webhook callback.
   */
  run(request: ComfyRequest, context: CallContext & CallContextExt): Promise<DeepPartial<JobSnapshot>>;
  /** Queue a workflow and await its outputs (synchronous) */
  runSync(
    request: ComfyRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<JobOutput>>;
  /** Looks up the most current job state */
  getJob(request: JobId, context: CallContext & CallContextExt): Promise<DeepPartial<JobSnapshot>>;
  /** Looks up the most current job state */
  streamJob(
    request: JobId,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<ComfyMessage>>;
  /** Gets the definitions of all nodes supported by this server */
  getNodeDefinitions(request: NodeDefRequest, context: CallContext & CallContextExt): Promise<DeepPartial<NodeDefs>>;
  /** Get models, grouped by architecture */
  getModelCatalog(
    request: ModelCatalogRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ModelCatalog>>;
  /**
   * Streams updates to local-files in realtime.
   * This is only used when running Comfy Creator with local files.
   */
  syncLocalFiles(
    request: Empty,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<LocalFiles>>;
}

export interface ComfyClient<CallOptionsExt = {}> {
  /**
   * Queue a workflow and receive the job id.
   * Results can be retrieved from the graph-id or via a webhook callback.
   */
  run(request: DeepPartial<ComfyRequest>, options?: CallOptions & CallOptionsExt): Promise<JobSnapshot>;
  /** Queue a workflow and await its outputs (synchronous) */
  runSync(request: DeepPartial<ComfyRequest>, options?: CallOptions & CallOptionsExt): AsyncIterable<JobOutput>;
  /** Looks up the most current job state */
  getJob(request: DeepPartial<JobId>, options?: CallOptions & CallOptionsExt): Promise<JobSnapshot>;
  /** Looks up the most current job state */
  streamJob(request: DeepPartial<JobId>, options?: CallOptions & CallOptionsExt): AsyncIterable<ComfyMessage>;
  /** Gets the definitions of all nodes supported by this server */
  getNodeDefinitions(request: DeepPartial<NodeDefRequest>, options?: CallOptions & CallOptionsExt): Promise<NodeDefs>;
  /** Get models, grouped by architecture */
  getModelCatalog(
    request: DeepPartial<ModelCatalogRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ModelCatalog>;
  /**
   * Streams updates to local-files in realtime.
   * This is only used when running Comfy Creator with local files.
   */
  syncLocalFiles(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): AsyncIterable<LocalFiles>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
