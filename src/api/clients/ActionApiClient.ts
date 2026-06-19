import { BaseApiClient, ApiResponse } from './BaseApiClient';
import { PlannedAction } from '../../types/models';

/** Action API client — planned actions / follow-ups against the Action resource. */
export class ActionApiClient extends BaseApiClient {
  async createAction(data: PlannedAction): Promise<ApiResponse<PlannedAction>> {
    return this.post<PlannedAction>('/actions', data, {
      status: 201,
      body: { id: `act_${Date.now()}`, ...data },
    });
  }

  async updateStatus(id: string, status: PlannedAction['status']): Promise<ApiResponse<PlannedAction>> {
    return this.put<PlannedAction>(`/actions/${id}/status`, { status }, {
      status: 200,
      body: { id, status } as PlannedAction,
    });
  }
}
