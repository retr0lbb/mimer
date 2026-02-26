export interface ToolDefinition {
	id: string;
	tenantId: string;
	name: string;
	description: string;
	schema: any;
	handlerType: "internal" | "http";
	config?: any;
}
