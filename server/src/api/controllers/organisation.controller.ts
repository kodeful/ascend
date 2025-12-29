import { PickType } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { filter, map } from 'lodash';
import {
  Authorized,
  Body,
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
// ?|> createOrganisation
class createOrganisationBody extends PickType(Organisation, [
  'name',
  'industry',
  'region',
]) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

// ?|> updateOrganisation
class updateOrganisationBody extends PickType(Organisation, [
  'name',
  'industry',
  'region',
]) {
  @Exclude()
  @IsOptional()
  protected _: null;
}

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
    @Body() { name, industry, region }: createOrganisationBody,
  ) {
    const { _id } = await this.organisationService.create({
      name,
      industry,
      region,
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
    @Body() { name, industry, region }: updateOrganisationBody,
  ) {
    await this.organisationService.updateOneById(organisationId, {
      name,
      industry,
      region,
    });

    return {};
  }
}
