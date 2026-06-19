import { Contact } from '../../types/models';

/**
 * Fluent request builders.
 *
 * Builders let a test assemble a payload field-by-field and express *intent*
 * ("a contact with no email") without repeating the whole object. They pair
 * with factories: factories give a realistic complete object, builders tweak
 * one field for a specific scenario.
 */
export class ContactRequestBuilder {
  private payload: Partial<Contact> = {};

  withFirstName(v: string): this {
    this.payload.firstName = v;
    return this;
  }
  withLastName(v: string): this {
    this.payload.lastName = v;
    return this;
  }
  withEmail(v: string): this {
    this.payload.email = v;
    return this;
  }
  withPhone(v: string): this {
    this.payload.phone = v;
    return this;
  }
  withCompany(v: string): this {
    this.payload.company = v;
    return this;
  }
  withStatus(v: Contact['status']): this {
    this.payload.status = v;
    return this;
  }
  /** Merge a factory-produced object as the starting point. */
  from(base: Partial<Contact>): this {
    this.payload = { ...this.payload, ...base };
    return this;
  }

  build(): Partial<Contact> {
    return { ...this.payload };
  }
}
