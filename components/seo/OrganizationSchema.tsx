import { buildOrganizationSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function OrganizationSchema() {
  return <JsonLd data={buildOrganizationSchema()} />;
}
