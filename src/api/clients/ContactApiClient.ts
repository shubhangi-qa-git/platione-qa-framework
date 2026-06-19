import { BaseApiClient, ApiResponse } from './BaseApiClient';
import { Contact } from '../../types/models';

/**
 * Contact API client — maps the Contact resource to typed methods.
 * Concrete clients stay thin: an endpoint path, a payload, and the mock shape.
 */
export class ContactApiClient extends BaseApiClient {
  async createContact(data: Contact): Promise<ApiResponse<Contact>> {
    return this.post<Contact>('/contacts', data, {
      status: 201,
      body: { id: `cnt_${Date.now()}`, ...data },
    });
  }

  async updateStatus(id: string, status: Contact['status']): Promise<ApiResponse<Contact>> {
    return this.put<Contact>(`/contacts/${id}/status`, { status }, {
      status: 200,
      body: { id, status } as Contact,
    });
  }

  async deleteContact(id: string): Promise<ApiResponse<{ id: string }>> {
    return this.del<{ id: string }>(`/contacts/${id}`, { status: 200, body: { id } });
  }
}
