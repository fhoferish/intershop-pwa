import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-hierarchies-create-group-page',
  templateUrl: './hierarchies-create-group-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesCreateGroupPageComponent implements OnInit {
  groupForm: FormGroup = this.fb.group({});

  submitted = false;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  items$: Observable<OrganizationGroup[]>;

  constructor(private fb: FormBuilder, private organizationFacade: OrganizationHierarchiesFacade) {}

  ngOnInit(): void {
    this.loading$ = this.organizationFacade.groupsLoading$;
    this.error$ = this.organizationFacade.groupsError$;
    this.items$ = this.organizationFacade.groups$;
  }

  submitForm() {
    if (this.groupForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.groupForm);
      return;
    }

    const formValue = this.groupForm.value;

    const child: OrganizationGroup = {
      id: uuid(),
      name: formValue.groupName,
      description: formValue.groupDescription === '' ? undefined : formValue.groupDescription,
    };

    this.organizationFacade.createAndAddGroup(formValue.parentGroupId, child);
  }

  get formDisabled() {
    return this.groupForm.invalid && this.submitted;
  }

  get groupName(): FormGroup {
    return this.groupForm.get('groupName') as FormGroup;
  }

  get parentGroup(): FormGroup {
    return this.groupForm.get('parentGroup') as FormGroup;
  }
}
