import { BadGatewayException, Injectable  } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface Moneda {
	codigo: string;
	nombre: string;
}

const BASE_URL = 'https://api.frankfurter.dev/v2';

@Injectable()
export class MonedasService {

	constructor(private readonly http: HttpService) {}

	async findAll(q?: string): Promise<Moneda[]> {
		try {
			const { data } = await firstValueFrom(
				this.http.get<Record<string, string>>(`${BASE_URL}/currencies`),
			);
			const monedas = Object.entries(data).map(([codigo, nombre]) => ({ codigo, nombre }));
			if (!q) return monedas;
			const t = q.toLowerCase();
			return monedas.filter(
				(m) => m.codigo.toLowerCase().includes(t) || m.nombre.toLowerCase().includes(t),
			);
		} catch {
			throw new BadGatewayException('No se pudo consultar a Frankfurter');
		}
	}
}

