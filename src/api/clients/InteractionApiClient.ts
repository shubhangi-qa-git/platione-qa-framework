import { BaseApiClient, ApiResponse } from './BaseApiClient';
import { Interaction } from '../../types/models';

/** Interaction API client — logs completed customer interactions. */
export class InteractionApiClient extends BaseApiClient {
  async createInteraction(data: Interaction): Promise<ApiResponse<Interaction>> {
    return this.post<Interaction>('/interactions', data, {
      status: 201,
      body: { id: `int_${Date.now()}`, ...data },
    });
  }
}
