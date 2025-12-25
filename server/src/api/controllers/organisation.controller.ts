import { Ref } from '@typegoose/typegoose';
import { filter, map } from 'lodash';
import {
  Authorized,
  BodyParam,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { Organisation } from 'api/models/organisation.model';
import { User, UserRole } from 'api/models/user.model';
import { OrganisationService } from 'api/services/organisation.service';
import { UserService } from 'api/services/user.service';

// Response Types
// Controller
@Authorized()
@JsonController('/organisation')
@OpenAPI({})
export class OrganisationController {
  constructor(
    private organisationService: OrganisationService,
    private userService: UserService,
  ) {}

  @Get('/me')
  @ResponseSchema(Organisation)
  public async getMeOrganisation(@Req() req) {
    return req.organisation;
  }

  @Get()
  @ResponseSchema(Organisation, { isArray: true })
  public async getOrganisations(@CurrentUser() user: User) {
    return this.organisationService.find({
      filter: {
        _id: { $in: map(filter(user.workspaces, 'verified'), 'organisation') },
      },
    });
  }

  @Post()
  @OpenAPI({
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  public async createOrganisation(
    @CurrentUser() user: User,
    @BodyParam('name', { required: true }) name: string,
    @BodyParam('industry', { required: false }) industry?: string,
  ) {
    const { _id } = await this.organisationService.create({
      name,
      industry,
    });

    await this.userService.updateOneById(user._id, {
      $push: {
        workspaces: {
          organisation: _id,
          role: UserRole.ADMIN,
          verified: true,
        },
      },
    });

    return _id.toString();
  }

  @Put('/:organisationId')
  @ResponseSchema(Organisation)
  public async updateOrganisation(
    @Param('organisationId') organisationId: Ref<Organisation>,
    @BodyParam('name', { required: true }) name: string,
    @BodyParam('industry', { required: false }) industry?: string,
  ) {
    await this.organisationService.updateOneById(organisationId, {
      name,
      industry,
    });

    return {};
  }
}
